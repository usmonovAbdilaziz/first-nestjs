import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemObjectsService } from './item-objects.service';
import { CreateItemObjectDto } from './dto/create-item-object.dto';
import { UpdateItemObjectDto } from './dto/update-item-object.dto';

@Controller('item-objects')
export class ItemObjectsController {
  constructor(private readonly itemObjectsService: ItemObjectsService) {}

  @Post()
  create(@Body() createItemObjectDto: CreateItemObjectDto) {
    return this.itemObjectsService.create(createItemObjectDto);
  }

  @Get()
  findAll() {
    return this.itemObjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemObjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemObjectDto: UpdateItemObjectDto) {
    return this.itemObjectsService.update(+id, updateItemObjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemObjectsService.remove(+id);
  }
}
