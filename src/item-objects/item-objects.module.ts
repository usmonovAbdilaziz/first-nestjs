import { Module } from '@nestjs/common';
import { ItemObjectsService } from './item-objects.service';
import { ItemObjectsController } from './item-objects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemObject } from './entities/item-object.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([ItemObject]), CategoryModule],
  controllers: [ItemObjectsController],
  providers: [ItemObjectsService],
})
export class ItemObjectsModule {}
