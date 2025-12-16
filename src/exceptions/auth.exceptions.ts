import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token has expired', HttpStatus.UNAUTHORIZED);
  }
}

export class AccessDeniedException extends HttpException {
  constructor() {
    super('Access denied', HttpStatus.FORBIDDEN);
  }
}
