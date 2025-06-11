import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect()
      .then(() => this.logger.log('Connected to the database'))
      .catch((error) => this.logger.error('Database connection error:', error));
  }

  private products: Product[] = [];
  create(createProductDto: CreateProductDto) {
    const { name, description, price } = createProductDto;
    const product = new Product(uuidv4(), name, description, price);
    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    return this.products.find((product) => product.id === id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const oldProduct = this.findOne(id);
    if (!oldProduct) {
      return new NotFoundException('Product not found');
    }

    const { name, description, price } = updateProductDto;
    const updatedProduct = { ...oldProduct, name, description, price };
    this.products = this.products.map((product) =>
      product.id === id ? updatedProduct : product,
    );

    return updatedProduct;
  }

  remove(id: string) {
    return this.products.filter((product) => product.id !== id);
  }
}
