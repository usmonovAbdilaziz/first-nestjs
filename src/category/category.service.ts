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
import { stat } from 'fs';
import { CategoryStatus } from 'src/Roles/roles';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @Inject(forwardRef(() => InfoService)) private infoservice: InfoService,
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
        relations: ['objs', 'subcategories', 'bulds'],
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
        relations: ['objs', 'subcategories', 'bulds'],
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
      const { infoName, description } = updateCategoryDto;

      if (!infoName || !description) {
        throw new ConflictException(
          'infoName va description ikkalasi ham bo‘lishi shart',
        );
      }

      const category = await this.categoryRepo.findOne({
        where: { id },
        relations: ['objs', 'subcategories', 'bulds'],
      });
      if (!category) throw new NotFoundException('Category not found');
      const oldData={
        objects:category.objs,
        buildings:category.bulds,
        category:category.subcategories
      }
      // Move va status yangilash
      const newMove = category.moved + 1;
      const newStatus = CategoryStatus.Moved;

      // Info yaratish
      const info = await this.infoservice.create({
        name: infoName,
        description,
        category_id: id,
        home: [{ data: oldData }],
      });

      // Historyga eski data qo‘shish
      const historyItem = {
        moved: category.moved,
        status: category.status,
        updatedAt: category.updatedAt,
        };

      // Category yangilash va history ga eski data qo‘shish
      category.moved = newMove;
      category.status = newStatus;
      category.history = [...category.history, historyItem];

      await this.categoryRepo.save(category);

      return succesMessage({ category, info });
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
