import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { TokenService } from '../utils/token';

@Module({
  imports: [AdminModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
})
export class AuthModule {}
