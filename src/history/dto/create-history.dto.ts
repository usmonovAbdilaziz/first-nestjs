import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';
export class CreateHistoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsObject()
    @IsJSON()
    data: object;
}
