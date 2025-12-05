import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BuildingName } from "../../Roles/roles";

export class CreateBuildingDto {
  @IsEnum(BuildingName)
  @IsNotEmpty()
  name: BuildingName;

  @IsNumber()
  @IsNotEmpty()
  category_id:number

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
  polka: number;
}
