import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CategoryNumber,
  CategoryStatus,
  CategoryType,
} from '../../Roles/roles';

export interface IHistory {
  oldData: object[];
  newData: object;
  timestamp: Date;
}
export class CreateCategoryDto {
  @IsEnum(CategoryType)
  @IsNotEmpty()
  name: CategoryType;

  @IsEnum(CategoryNumber)
  @IsNotEmpty()
  categoryNumber: CategoryNumber;

  @IsArray()
  @IsOptional()
  history?: IHistory[];

  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: CategoryStatus;
}
