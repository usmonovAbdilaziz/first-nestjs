import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { BuildingModule } from '../building/building.module';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location]),CategoryModule,BuildingModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
