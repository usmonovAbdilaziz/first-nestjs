import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty({ message: 'Xar bir maxsulot nomi bulishi kerak' })
  @IsString({ message: 'Maxsulot nomini suzlar bilan yozing' })
  name: string;

  @IsNotEmpty({ message: 'Maxsulot narxi bulsin' })
  @IsNumber({}, { message: 'Maxsulot narxini raqam bilan yozing' })
  price: number;
}
