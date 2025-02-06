import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Slot } from '../slots/slot.entity';
import { Carpenter } from '../users/carpenter.entity';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Carpenter, (carpenter) => carpenter.bookings, { onDelete: 'CASCADE' })
  carpenter: Carpenter;

  @OneToOne(() => Slot, (slot) => slot.booking, { onDelete: 'CASCADE' })
  @JoinColumn()
  slot: Slot;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;
  
}
