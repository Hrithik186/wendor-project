import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Slot } from '../slots/slot.entity';
import { User } from '../users/user.entity';
import { Carpenter } from '../users/carpenter.entity';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Slot, User, Carpenter]), SlotsModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
