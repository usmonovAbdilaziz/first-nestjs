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

  /**
   * Find all categories with minimal relations for clean response
   */
  async findAll() {
    try {
      const categories = await this.categoryRepo.find({
        relations: ['objs', 'subcategories'],
        order: { name: 'ASC' },
      });
      return succesMessage(categories);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Find a category by ID with minimal relations for clean response
   */
  async findOne(id: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id },
        relations: ['objs', 'subcategories'],
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return succesMessage(category);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Update a category by ID
   * Handles history updates properly while avoiding type conflicts
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      // Get the current category to preserve existing history
      const existingCategory = await this.categoryRepo.findOne({
        where: { id },
      });
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }

      // Separate history from other update data
      const { history, ...otherUpdateData } = updateCategoryDto;

      // If history is provided, merge it with existing history
      let updatedHistory = existingCategory.history || [];
      if (history && history.length > 0) {
        updatedHistory = [...updatedHistory, ...history];
      }

      // Prepare update data with proper history
      const updateData = {
        ...otherUpdateData,
        history: updatedHistory,
      };

      // Perform the update
      await this.categoryRepo.update(id, updateData);

      // Return the updated category
      const updatedCategory: any = await this.findOne(id);
      return succesMessage(updatedCategory?.data);
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
