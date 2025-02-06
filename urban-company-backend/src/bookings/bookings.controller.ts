import { Controller, Post, Body, UseGuards, Get, Param, Delete, Request, HttpException, HttpStatus } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // Create a new booking
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createBooking(@Request() req, @Body() body: { slotId: number }) {
    const userId = req.user.userId;
    return this.bookingsService.createBooking(userId, body.slotId);
  }

  // Get bookings for the logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserBookings(@Request() req) {
    const userId = req.user.userId;
    return this.bookingsService.getUserBookings(userId);
  }

  // Cancel a booking (only by the user who booked)
  @UseGuards(JwtAuthGuard)
  @Delete(':bookingId/cancel')
  async cancelBooking(@Request() req, @Param('bookingId') bookingId: number) {
    const userId = req.user.userId;
    return this.bookingsService.cancelBooking(userId, bookingId);
  }

  // For carpenters: get bookings assigned to them
  @UseGuards(JwtAuthGuard)
  @Get('carpenter')
  async getCarpenterBookings(@Request() req) {
    const user = req.user;

    // Check if the user is a carpenter
    if (user.role !== 'carpenter') {
      // Return 403 Forbidden if the user is not a carpenter
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }

    try {
      // Assuming the carpenter's ID is the same as the user ID
      const bookings = await this.bookingsService.getCarpenterBookings(user.userId);
      return bookings;
    } catch (error) {
      // Handle any errors that might occur
      throw new HttpException('Unable to fetch carpenter bookings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
