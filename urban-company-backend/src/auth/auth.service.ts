import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async generateToken(user: any) {
    const payload = { sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }


  async login(user: User) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
        throw new BadRequestException("Password is required");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.usersService.create({
        ...userData,
        password: hashedPassword
    });

    return newUser;
}
}
