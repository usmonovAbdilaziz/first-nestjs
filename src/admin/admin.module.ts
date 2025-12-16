import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Crypto } from '../utils/hash.pass'; // Import Crypto service
import { SeederService } from './seder.service'; // Import SeederService
import { TokenService } from 'src/utils/token';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, Crypto, SeederService, TokenService], // Add Crypto and SeederService to providers
  exports: [Crypto,TokenService,AdminService], // Export Crypto so it can be used in other modules
})
export class AdminModule {}
