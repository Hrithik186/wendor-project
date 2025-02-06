import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Carpenter } from './carpenter.entity';
import { Booking } from '../bookings/booking.entity';

export enum UserRole {
  USER = 'user',
  CARPENTER = 'carpenter',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string; // store hashed passwords
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  
  @OneToOne(() => Carpenter, (carpenter) => carpenter.user)
  carpenter: Carpenter;
  
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
