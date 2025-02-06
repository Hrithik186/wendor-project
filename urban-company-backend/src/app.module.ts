import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SlotsModule } from './slots/slots.module';
import { BookingsModule } from './bookings/bookings.module';
import { User } from './users/user.entity';
import { Carpenter } from './users/carpenter.entity';
import { Slot } from './slots/slot.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'bookingdb',
      entities: [User, Carpenter, Slot, Booking],
      synchronize: true, // set to false in production!
    }),
    UsersModule,
    AuthModule,
    SlotsModule,
    BookingsModule,
  ],
})
export class AppModule {}