import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetProductByIdDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  id: number;
}
