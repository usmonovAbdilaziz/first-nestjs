import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProducts } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: IProducts[] = [];
  getAll() {
    return this.products;
  }
  create(createProductDto: CreateProductDto) {
    this.products.push(createProductDto);
    return this.products;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((prod) => prod.id === id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((prod) => prod.id === id);
    if (index == -1) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    this.products[index] = updateProductDto;
    return this.products;
  }

  remove(id: number) {
    const index = this.products.findIndex((prod) => prod.id === id);
    if (index == -1) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    this.products.splice(index, 1);
    return this.products;
  }
}
