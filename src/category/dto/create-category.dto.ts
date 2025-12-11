import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoryNumber, CategoryStatus, CategoryType, StatusType } from "../../Roles/roles";

export class CreateCategoryDto {
  @IsEnum(CategoryType)
  @IsNotEmpty()
  name: CategoryType;

  @IsEnum(CategoryNumber)
  @IsNotEmpty()
  categoryNumber: CategoryNumber;

  @IsNumber()
  @IsOptional()
  moved?: number;

  @IsEnum(StatusType)
  @IsNotEmpty()
  statusType: StatusType;

  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: CategoryStatus;
}
