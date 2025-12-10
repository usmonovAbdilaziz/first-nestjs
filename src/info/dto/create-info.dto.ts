import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

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
  home:{data:object }[]

}
