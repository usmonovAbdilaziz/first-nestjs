import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { handleError, succesMessage } from '../utils/response';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private readonly buildRepo: Repository<Building>,
    private readonly categoryServise: CategoryService,
  ) {}
  async create(createBuildingDto: CreateBuildingDto) {
    try {
      const { name, category_id } = createBuildingDto;
      const category = await this.categoryServise.findOne(category_id);
      if (!category) throw new NotFoundException('Category not found');
      const exists = await this.buildRepo.findOne({ where: { name } });
      if (exists) {
        throw new ConflictException('This building already exists');
      }
      const newBuilding = this.buildRepo.create({ ...createBuildingDto });
      await this.buildRepo.save(newBuilding);
      return succesMessage(newBuilding, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const buildings = await this.buildRepo.find({ relations: ['category'] });
      return succesMessage(buildings);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const exists = await this.buildRepo.findOne({
        where: { category_id: id },
        relations: ['category'],
      });
      if (!exists) {
        throw new NotFoundException('This building not found');
      }
      return succesMessage(exists);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto) {
    try {
      await this.buildRepo.update({ category_id: id }, updateBuildingDto);
      const newBilding = await this.findOne(id);
      return succesMessage(newBilding!.data);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.buildRepo.delete({ id });
      return succesMessage(['Building deleted succesfully']);
    } catch (error) {
      handleError(error);
    }
  }
}
