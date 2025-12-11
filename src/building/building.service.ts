import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
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
  ) {}
  async create(createBuildingDto: CreateBuildingDto) {
    try {
      const { name, floors, rooms, showcase, polkas } = createBuildingDto;

      const exists = await this.buildRepo.findOne({
        where: { name, floors, rooms, showcase, polkas },
      });
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
      const buildings = await this.buildRepo.find({
        relations: ['locations'],
        order: { name: 'ASC' },
      });
      return succesMessage(buildings);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const exists = await this.buildRepo.findOne({
        where: { id },
        relations: ['locations'],
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
      await this.buildRepo.update(id, updateBuildingDto);
      const newBuild = await this.buildRepo.findOne({ where: { id } });
      if (!newBuild) {
        throw new NotFoundException('Buildings not found');
      }
      return succesMessage(newBuild);
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
