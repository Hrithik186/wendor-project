import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { Carpenter } from '../users/carpenter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Carpenter])],
  providers: [SlotsService],
  controllers: [SlotsController],
  exports: [SlotsService],
})
export class SlotsModule {}
