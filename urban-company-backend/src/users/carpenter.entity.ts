import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Slot } from '../slots/slot.entity';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Carpenter {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToOne(() => User, (user) => user.carpenter, { cascade: true })
  @JoinColumn()
  user: User;
  
  @Column({ nullable: true })
  specialization: string;
  
  @Column({ default: true })
  isAvailable: boolean;
  
  @OneToMany(() => Slot, (slot) => slot.carpenter)
  slots: Slot[];
  
  @OneToMany(() => Booking, (booking) => booking.carpenter)
  bookings: Booking[];
}
