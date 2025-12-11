import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BuildingName } from "../../Roles/roles";

export class CreateBuildingDto {
  @IsEnum(BuildingName)
  @IsNotEmpty()
  name: BuildingName;

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

  @IsString()
  @IsOptional()
  oldBuilding?: string;
}
