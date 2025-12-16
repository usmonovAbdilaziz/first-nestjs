import {
  HttpException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

export const handleError = (error: any, code = 500) => {
  if (error instanceof HttpException) {
    throw error;
  }

  // Handle database constraint errors specifically
  if (error.code === '23505' || error.message?.includes('duplicate')) {
    throw new ConflictException(
      error.detail || error.message || 'Resource already exists',
    );
  }

  // Handle foreign key constraint errors
  if (error.code === '23503' || error.message?.includes('foreign key')) {
    throw new BadRequestException(
      error.detail || error.message || 'Referenced resource not found',
    );
  }

  // Handle not found errors
  if (error.message?.includes('not found')) {
    throw new NotFoundException(error.message);
  }

  throw new InternalServerErrorException(
    error.message || 'Internal server error',
  );
};

export const succesMessage = (data: object, code = 200) => {
  return {
    statusCode: code,
    message: 'success',
    data,
  };
};
