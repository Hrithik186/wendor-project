import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Carpenter } from './carpenter.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Carpenter])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
