import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Carpenter } from './carpenter.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Carpenter) private carpenterRepository: Repository<Carpenter>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);
    // If the new user is a carpenter, create a corresponding Carpenter record
    if (savedUser.role === 'carpenter') {
      const carpenter = this.carpenterRepository.create({
        user: savedUser,
        specialization: '',
        isAvailable: true,
      });
      await this.carpenterRepository.save(carpenter);
    }
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
}
async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
}
}
