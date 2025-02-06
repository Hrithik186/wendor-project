import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { Slot } from './slot.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('slots')
export class SlotsController {
  constructor(private slotsService: SlotsService) {}

  @Get('available')
  async getAvailableSlots(@Query('carpenterId') carpenterId: string): Promise<Slot[]> {
    const id = carpenterId ? parseInt(carpenterId, 10) : undefined;
    return this.slotsService.getAvailableSlots(id);
  }

  @UseGuards(AuthGuard('jwt')) // Protect route with authentication
    @Post('create')
    async createSlot(
        @Request() req, // Get user info from token
        @Body() body: { startTime: string; endTime: string }
    ) {
        if (req.user.role !== 'carpenter') {
            throw new ForbiddenException('Only carpenters can create slots');
        }

        return this.slotsService.createSlot(
            req.user.id, // Carpenter's ID from token
            new Date(body.startTime),
            new Date(body.endTime)
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':slotId/unavailable')
    async markSlotUnavailable(@Request() req, @Param('slotId') slotId: number) {
        if (req.user.role !== 'carpenter') {
            throw new ForbiddenException('Only carpenters can mark slots as unavailable');
        }
        return this.slotsService.markSlotUnavailable(slotId);
    }

    // ✅ Mark a slot as available again
    @UseGuards(AuthGuard('jwt'))
    @Patch(':slotId/available')
    async markSlotAvailable(@Request() req, @Param('slotId') slotId: number) {
        if (req.user.role !== 'carpenter') {
            throw new ForbiddenException('Only carpenters can mark slots as available');
        }
        return this.slotsService.markSlotAvailable(slotId);
    }
}
