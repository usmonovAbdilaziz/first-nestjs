
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class StatusDto {
  @IsString()
  key: string;
}

export class CreateSubCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatusDto)
  status: StatusDto[];

  @IsNumber()
  @IsNotEmpty()
  category_id: number; // Category bilan bog‘lash uchun
}

