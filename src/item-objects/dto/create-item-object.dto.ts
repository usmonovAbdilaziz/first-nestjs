import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { FondType, ItemStatus } from "../../Roles/roles";

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

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsEnum(ItemStatus)
  @IsNotEmpty()
  status: ItemStatus;

  @IsEnum(FondType)
  @IsNotEmpty()
  fondType: FondType;
}
