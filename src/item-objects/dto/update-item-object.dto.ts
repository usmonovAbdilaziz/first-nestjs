import { PartialType } from '@nestjs/mapped-types';
import { CreateItemObjectDto } from './create-item-object.dto';

export class UpdateItemObjectDto extends PartialType(CreateItemObjectDto) {}
