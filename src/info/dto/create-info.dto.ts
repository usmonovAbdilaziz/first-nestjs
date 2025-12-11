import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Reason } from 'src/Roles/roles';

export class CreateInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsOptional()
  home: { data: object }[];

  @IsEnum(Reason)
  @IsNotEmpty()
  reasonForTransfer: Reason;
}
