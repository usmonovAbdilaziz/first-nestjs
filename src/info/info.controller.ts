import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InfoService } from './info.service';
import { CreateInfoDto } from './dto/create-info.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { Roles } from 'src/decorators/public.decorator';
import { RoleUser } from 'src/Roles/roles';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post()
  create(@Body() createInfoDto: CreateInfoDto) {
    return this.infoService.create(createInfoDto);
  }

  @Get()
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  findAll() {
    return this.infoService.findAll();
  }

  @Get(':id')
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.infoService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateInfoDto: UpdateInfoDto) {
    return this.infoService.update(+id, updateInfoDto);
  }

  @Delete(':id')
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.infoService.remove(+id);
  }
}
