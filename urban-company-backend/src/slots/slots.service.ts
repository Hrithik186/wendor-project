import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { Repository } from 'typeorm';
import { Carpenter } from '../users/carpenter.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    @InjectRepository(Carpenter)
    private carpenterRepository: Repository<Carpenter>,
  ) {}

  async getAvailableSlots(carpenterId?: number): Promise<Slot[]> {
    const query = this.slotRepository.createQueryBuilder('slot')
      .where('slot.isAvailable = :isAvailable', { isAvailable: true });
    if (carpenterId) {
      query.andWhere('slot.carpenterId = :carpenterId', { carpenterId });
    }
    return query.getMany();
  }

  async createSlot(carpenterId: number, startTime: Date, endTime: Date): Promise<Slot> {
    const carpenter = await this.carpenterRepository.findOne({ where: { id: carpenterId } });
    if (!carpenter) {
      throw new NotFoundException('Carpenter not found');
    }
    const slot = this.slotRepository.create({ carpenter, startTime, endTime, isAvailable: true });
    return this.slotRepository.save(slot);
  }

  async markSlotUnavailable(slotId: number): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id: slotId } });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    slot.isAvailable = false;
    return this.slotRepository.save(slot);
  }

  async markSlotAvailable(slotId: number): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id: slotId } });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    slot.isAvailable = true;
    return this.slotRepository.save(slot);
  }
}
