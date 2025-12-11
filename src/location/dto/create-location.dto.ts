import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLocationDto {
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsNumber()
  @IsNotEmpty()
  building_id: number;

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
}
