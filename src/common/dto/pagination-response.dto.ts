import { Expose, Type } from 'class-transformer';

export class PaginationMetaDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  total_pages: number;
}

export class PaginatedResponseDto<T> {
  @Expose()
  @Type(() => Object)
  data: T[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
