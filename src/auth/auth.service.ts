import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { TokenService } from '../utils/token';
import { Crypto } from '../utils/hash.pass';
import { AdminService } from '../admin/admin.service';
import { handleError, succesMessage } from '../utils/response';
import { InvalidCredentialsException } from '../exceptions/auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly tokenService: TokenService,
    private readonly cryptoService: Crypto,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const admin: any = await this.adminService.findEmail(email);
    if (!admin) throw new InvalidCredentialsException();

    const compare = await this.cryptoService.comparePassword(
      password,
      admin.password,
    );
    if (!compare) throw new InvalidCredentialsException();

    const payload = { id: admin.id, role: admin.role, email: admin.email };

    try {
      const accessToken = await this.tokenService.generateAccessToken(payload);
      return succesMessage({ admin, token: accessToken });
    } catch (error) {
      throw new Error('Failed to generate token');
    }
  }
  async getProfile(user: any) {
    try {
      const admin = await this.adminService.findOne(user.id);
    } catch (error) {
      handleError(error)
    }
  }
}
