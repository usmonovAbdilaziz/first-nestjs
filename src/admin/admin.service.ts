import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { handleError, succesMessage } from 'src/utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { RoleUser } from 'src/Roles/roles';
import { Crypto } from '../utils/hash.pass'; // Import custom Crypto service
import { emitWarning } from 'process';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly cryptoService: Crypto,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
    const { email, password } = createAdminDto;
    const existsEmail = await this.adminRepository.findOne({
      where: { email },
    });
    if (existsEmail) {
      throw new ConflictException('Email already exists');
    }
    const hashPass = await this.cryptoService.hashPassword(password);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashPass, // Set as super admin by default when creating through seeder
    });
    await this.adminRepository.save(admin);
    return succesMessage(admin, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const admin = await this.adminRepository.find();
      return succesMessage(admin);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminRepository.findOne({ where: { id } });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return succesMessage(admin);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const { password, confirmPassword } = updateAdminDto;

    if (password) {
      if (!password || !confirmPassword)
        throw new NotFoundException('Password or Confirm Password is missing');
      const { data } = (await this.findOne(id)) as any;

      const compare = await this.cryptoService.comparePassword(
        confirmPassword,
        data.password,
      );
      if (!compare) throw new NotFoundException('Password does not match');
      updateAdminDto.password = await this.cryptoService.hashPassword(password);
    }
    const updatePayload = {
      password: updateAdminDto.password,
      name: updateAdminDto.name,
      email: updateAdminDto.email,
      role: updateAdminDto.role,
    };
    await this.adminRepository.update(id, updatePayload);
    const admin: Admin | null = await this.adminRepository.findOne({
      where: { id },
    });
    return succesMessage(admin!);
  }

  async remove(id: number) {
    try {
      const admin = await this.findOne(id);
      await this.adminRepository.delete({ id });
      return succesMessage(admin!);
    } catch (error) {
      handleError(error);
    }
  }

  async findEmail(email: string) {
    try {
      const admin = await this.adminRepository.findOne({ where: { email } });
      return admin;
    } catch (error) {
      handleError(error);
    }
  }
}
