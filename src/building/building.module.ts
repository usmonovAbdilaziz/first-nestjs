import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingService } from './building.service';
import { Building } from './entities/building.entity';
import { BuildingController } from './building.controller';
import { Category } from 'src/category/entities/category.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports:[TypeOrmModule.forFeature([Building]),CategoryModule],
  controllers: [BuildingController],
  providers: [BuildingService],
})
export class BuildingModule {}
