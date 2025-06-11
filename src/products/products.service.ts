import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from '../common/dto/pagination.dto';
import { GetProductByIdDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect()
      .then(() => this.logger.log('Connected to the database'))
      .catch((error) => this.logger.error('Database connection error:', error));
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    this.logger.log(`Fetching products - Page: ${page}, Limit: ${limit}`);

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);
    if (page < 1 || page > lastPage) {
      this.logger.warn(
        `Invalid page number: ${page}. Valid range is 1 to ${lastPage}.`,
      );
      throw new BadRequestException(
        `Invalid page number: ${page}. Valid range is 1 to ${lastPage}.`,
      );
    }
    this.logger.log(
      `Total products: ${totalPages}, Total pages: ${Math.ceil(totalPages / limit)}`,
    );

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      meta: {
        total: totalPages,
        page,
        limit,
        lastPage,
      },
    };
    // return this.products; // Uncomment if using in-memory products array
  }

  async findOne(GetProductByIdDto) {
    const { id } = GetProductByIdDto;
    this.logger.log(`Fetching product with ID: ${id}`);
    // existe el producto?
    const product = await this.product.findUnique({
      where: { id },
    });
    if (!product) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new BadRequestException(`Product with ID ${id} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    this.logger.log(`Updating product with ID: ${id}`);
    // existe el producto?
    const product = this.product.findUnique({
      where: { id },
    });

    if (!product) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new BadRequestException(`Product with ID ${id} not found`);
    }

    // Exclude 'id' from update data
    const { id: _id, ...updateData } = updateProductDto as any;
    return this.product.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: number) {
    this.logger.log(`Removing product with ID: ${id}`);
    // existe el producto?
    const product = this.product.findUnique({
      where: { id },
    });

    if (!product) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new BadRequestException(`Product with ID ${id} not found`);
    }

    return this.product.delete({
      where: { id },
    });
  }
}
