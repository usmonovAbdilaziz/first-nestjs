import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Reason } from 'src/Roles/roles';

export class CreateLocationDto {
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsNumber()
  @IsNotEmpty()
  building_id: number;

  @IsNumber()
  @IsNotEmpty()
  itemObject_id?: number;

  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @IsNumber()
  @IsNotEmpty()
  room: number;

  @IsNumber()
  @IsNotEmpty()
  showcase: number;

  @IsNumber()
  @IsNotEmpty()
  polka: number;
  //for info
  @IsString()
  @IsOptional()
  infoName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Reason)
  @IsOptional()
  reasonForTransfer?: Reason;
}
