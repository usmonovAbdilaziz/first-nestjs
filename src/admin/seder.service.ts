import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Crypto } from '../utils/hash.pass';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RoleUser } from 'src/Roles/roles';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly cryptoService: Crypto,
  ) {}

  async onApplicationBootstrap() {
    await this.createSuperAdmin();
  }

  async createSuperAdmin() {
    const email = process.env.SUPER_ADMIN_EMAIL as string;
    const password = process.env.SUPER_ADMIN_PASS as string;
    const name = process.env.SUPER_ADMIN_NAME as string;

    if (!email || !password) {
      console.warn(
        'SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASS environment variables not set',
      );
      return;
    }

    const existsEmail = await this.adminRepository.findOne({
      where: { email },
    });

    if (!existsEmail) {
      // Hash the password before creating the admin
      const hashedPassword = await this.cryptoService.hashPassword(password);

      // Create DTO with email and hashed password
      const createAdminDto: CreateAdminDto = {
        email,
        password: hashedPassword,
        role: RoleUser.SUPERADMIN,
        name,
      };
      const admin = this.adminRepository.create(createAdminDto);
      await this.adminRepository.save(admin);
      console.log('Super admin created successfully');
    } else {
      console.log('Super admin already exists');
    }
  }
}
