import { Module } from '@nestjs/common';
import { ItemObjectsService } from './item-objects.service';
import { ItemObjectsController } from './item-objects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemObject } from './entities/item-object.entity';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([ItemObject]), CategoryModule,SubCategoryModule],
  controllers: [ItemObjectsController],
  providers: [ItemObjectsService],
})
export class ItemObjectsModule {}
