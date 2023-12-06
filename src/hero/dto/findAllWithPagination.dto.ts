import { IsOptional, IsNumber } from 'class-validator';

export class FindAllWithPaginationDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}
