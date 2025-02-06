import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { Repository } from 'typeorm';
import { Slot } from '../slots/slot.entity';
import { SlotsService } from '../slots/slots.service';
import { User } from '../users/user.entity';
import { Carpenter } from '../users/carpenter.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Carpenter)
    private carpenterRepository: Repository<Carpenter>,
    private slotsService: SlotsService,
  ) {}

  async createBooking(userId: number, slotId: number): Promise<Booking> {
    // Fetch slot along with its assigned carpenter
    const slot = await this.slotRepository.findOne({ where: { id: slotId }, relations: ['carpenter'] });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    if (!slot.isAvailable) {
      throw new BadRequestException('Slot is already booked');
    }
    // Fetch user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Create booking
    const booking = this.bookingRepository.create({
      user,
      slot,
      carpenter: slot.carpenter,
      status: BookingStatus.CONFIRMED,
    });
    // Mark slot as unavailable
    slot.isAvailable = false;
    await this.slotRepository.save(slot);
    return this.bookingRepository.save(booking);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['slot', 'carpenter', 'user'],
    });
  }

  async cancelBooking(userId: number, bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user', 'slot'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.user.id !== userId) {
      throw new BadRequestException('You are not authorized to cancel this booking');
    }
    booking.status = BookingStatus.CANCELLED;
    // Mark slot as available again
    const slot = booking.slot;
    slot.isAvailable = true;
    await this.slotRepository.save(slot);
    return this.bookingRepository.save(booking);
  }

  async getCarpenterBookings(carpenterId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { carpenter: { id: carpenterId } },
      relations: ['slot', 'user'],
    });
  }
}
