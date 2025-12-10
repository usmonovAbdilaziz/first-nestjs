import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { handleError, succesMessage } from '../utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { CategoryService } from '../category/category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subRepo: Repository<SubCategory>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    try {
      const { category_id } = createSubCategoryDto;

      const existsCategory = await this.categoryService.findOne(category_id);
      if (!existsCategory) throw new NotFoundException('Category not found');
      const newSub = this.subRepo.create({ ...createSubCategoryDto });
      await this.subRepo.save(newSub);
      return succesMessage(newSub, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const subs = await this.subRepo.find({ relations: ['category'] });
      return succesMessage(subs);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const subId = await this.subRepo.findOne({ where: { id } });
      if (!subId) throw new NotFoundException('Sub categoriy not found');
      return succesMessage(subId);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    try {
      await this.subRepo.update({ category_id: id }, updateSubCategoryDto);
      const subId = await this.findOne(id);
      return succesMessage(subId!.data);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.subRepo.delete({ id });
      return succesMessage(['Sub category deleted succesfully']);
    } catch (error) {
      handleError(error);
    }
  }
}
