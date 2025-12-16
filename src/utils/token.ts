import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

@Injectable()
export class TokenService {
  async generateAccessToken(payload: any): Promise<string> {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    const options: SignOptions = {
      expiresIn:
        (process.env.JWT_ACCESS_TIME as StringValue) || ('15m' as StringValue),
    };

    return jwt.sign(payload, secret, options);
  }

  async generateRefreshToken(payload: any): Promise<string> {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    const options: SignOptions = {
      expiresIn:
        (process.env.JWT_REFRESH_TIME as StringValue) || ('7d' as StringValue),
    };

    return jwt.sign(payload, secret, options);
  }

  async verify(token: string): Promise<any> {
    // Use the same secret that was used to sign the token
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT_ACCESS_SECRET is not defined');
    }

    return jwt.verify(token, secret);
  }
}
