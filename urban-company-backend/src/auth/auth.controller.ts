import { Controller, Post, Body, UnauthorizedException, BadRequestException, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post("register")
async register(@Body() body: { name: string, email: string, password: string, role?: UserRole }): Promise<User> {
    if (body.role && !Object.values(UserRole).includes(body.role as UserRole)) {
        throw new BadRequestException("Invalid role");
    }
    return this.authService.register(body);
}


@Post('login')
async login(@Body() body: { email: string, password: string }) {
  const user = await this.authService.validateUser(body.email, body.password);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const token = await this.authService.generateToken(user); // Generate JWT or session token

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,  // ✅ Ensure role is included
    token,  // ✅ Include token in response
  };
}

  @UseGuards(AuthGuard('jwt'))  // ✅ Protect with JWT Auth Guard
    @Get('profile')
    async getProfile(@Request() req) {
        return await this.usersService.findByEmail(req.user.email);
    }
}
