import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BuildingName } from "../../Roles/roles";

export class CreateBuildingDto {
  @IsEnum(BuildingName)
  @IsNotEmpty()
  name: BuildingName;

  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsNumber()
  @IsNotEmpty()
  floors: number;

  @IsNumber()
  @IsNotEmpty()
  rooms: number;

  @IsNumber()
  @IsNotEmpty()
  showcase: number;

  @IsNumber()
  @IsNotEmpty()
  polkas: number;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsNumber()
  @IsOptional()
  room?: number;

  @IsNumber()
  @IsOptional()
  showcas?: number;

  @IsNumber()
  @IsOptional()
  polka?: number;

  @IsString()
  @IsOptional()
  selectBuilding?: string;
}
