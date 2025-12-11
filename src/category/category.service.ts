import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { handleError, succesMessage } from '../utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InfoService } from '../info/info.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name, categoryNumber } = createCategoryDto;
      const exists = await this.categoryRepo.findOne({
        where: [{ categoryNumber }, { name }],
      });
      if (exists) {
        throw new ConflictException('This Category already exists');
      }
      const newCategory = this.categoryRepo.create({ ...createCategoryDto });
      await this.categoryRepo.save(newCategory);
      return succesMessage(newCategory, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepo.find({
        relations: ['objs', 'subcategories', 'locations'],
        order: { name: 'ASC' },
      });
      return succesMessage(categories);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const exists = await this.categoryRepo.findOne({
        where: { id },
        relations: ['objs', 'subcategories', 'locations'], order: { name: 'ASC' }
      });
      if (!exists) {
        throw new NotFoundException('Category not found');
      }
      return succesMessage(exists);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
     await this.categoryRepo.update(id,updateCategoryDto)
     const category = await this.findOne(id)

      return succesMessage(category!.data);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.categoryRepo.delete({ id });
      return succesMessage(['Category deleted successfully']);
    } catch (error) {
      handleError(error);
    }
  }
}
