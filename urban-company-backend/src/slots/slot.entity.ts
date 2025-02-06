import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Carpenter } from '../users/carpenter.entity';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carpenter, (carpenter) => carpenter.slots, { onDelete: 'CASCADE' })
  carpenter: Carpenter;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToOne(() => Booking, (booking) => booking.slot)
  booking: Booking;
}
