import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from '../decorators/roles.decorator';
import { RoleUser } from '../Roles/roles';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(RoleUser.SUPERADMIN)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @Roles(RoleUser.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
