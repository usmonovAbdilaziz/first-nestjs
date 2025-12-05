import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemObjectDto } from './dto/create-item-object.dto';
import { UpdateItemObjectDto } from './dto/update-item-object.dto';
import { handleError, succesMessage } from '../utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemObject } from './entities/item-object.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ItemObjectsService {
  constructor(
    @InjectRepository(ItemObject)
    private readonly itemObjRepo: Repository<ItemObject>,
    private readonly categoryService:CategoryService
  ) {}
  async create(createItemObjectDto: CreateItemObjectDto) {
    try {
      const {category_id,name}=createItemObjectDto
      const existsCategory = await this.categoryService.findOne(category_id)
      if(!existsCategory) throw new NotFoundException('Category not found')
      const exists = await this.itemObjRepo.findOne({where:{name}})
      if(exists){
        throw new ConflictException('This Object already exists')
      }
    const newObject = this.itemObjRepo.create({
      ...createItemObjectDto,
    });
    await this.itemObjRepo.save(newObject)
    return succesMessage(newObject,201)
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const items = await this.itemObjRepo.find({ relations: ['category'] });
      return succesMessage(items)
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.itemObjRepo.findOne({where:{id}})
      if(!item) throw new NotFoundException('This object not found')
        return succesMessage(item)
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateItemObjectDto: UpdateItemObjectDto) {
    try {
      await  this.itemObjRepo.update(id,updateItemObjectDto)
      const newItem = await this.findOne(id)
      return succesMessage(newItem!.data)
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id)
      await this.itemObjRepo.delete({id})
      return succesMessage(['Object deleted succesfully'])
    } catch (error) {
      handleError(error);
    }
  }
}
