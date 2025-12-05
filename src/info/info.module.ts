import {  forwardRef, Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from './entities/info.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Info]), forwardRef(() => CategoryModule)],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
