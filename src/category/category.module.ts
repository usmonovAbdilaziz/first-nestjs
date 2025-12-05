import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { InfoModule } from '../info/info.module';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => InfoModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
