import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInfoDto } from './dto/create-info.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { handleError, succesMessage } from '../utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Info } from './entities/info.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(Info) private readonly infoRepo: Repository<Info>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  async create(createInfoDto: CreateInfoDto) {
    try {
      const { category_id } = createInfoDto;
      const exists = await this.categoryService.findOne(category_id);
      if (!exists) throw new NotFoundException('Category not found');

      const newInfo = this.infoRepo.create({ ...createInfoDto });
      await this.infoRepo.save(newInfo);
      return succesMessage(newInfo);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const infos = await this.infoRepo.find({
        relations: ['category'],
      });
      return succesMessage(infos);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const info = await this.infoRepo.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!info) throw new NotFoundException('Info not found');

      return succesMessage(info);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateInfoDto: UpdateInfoDto) {
    try {
      await this.infoRepo.update(id, updateInfoDto);
      const updated = await this.findOne(id);

      return succesMessage(updated!.data);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.infoRepo.delete({ id });
      return succesMessage(['Deleted successfully']);
    } catch (error) {
      handleError(error);
    }
  }
}
