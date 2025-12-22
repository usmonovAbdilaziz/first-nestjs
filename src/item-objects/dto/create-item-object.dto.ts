import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoryStatus, FondType, ItemStatus } from "../../Roles/roles";

export class CreateItemObjectDto {
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  period: number;

  @IsNumber()
  @IsOptional()
  moved?: number;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsEnum(CategoryStatus)
  @IsOptional()
  statusCategory?: CategoryStatus;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsEnum(ItemStatus)
  @IsNotEmpty()
  status: ItemStatus;

  @IsEnum(FondType)
  @IsNotEmpty()
  fondType: FondType;

  @IsNumber()
  @IsNotEmpty()
  sub_category_id: number;

  @IsString()
  @IsNotEmpty()
  subCategory: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
