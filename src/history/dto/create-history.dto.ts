import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
class NestedData {
  @IsString()
  key: string;

  @IsObject()
  info: object;
}

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => NestedData)
  data: NestedData;
}
