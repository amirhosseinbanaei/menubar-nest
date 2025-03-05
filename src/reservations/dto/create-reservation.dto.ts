import {
  IsString,
  IsInt,
  IsOptional,
  IsDate,
  Min,
  Length,
  Matches,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  reservation_date: Date;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in format HH:mm (24-hour)',
  })
  start_time: string;

  @IsOptional()
  @IsInt()
  duration_minutes?: number;

  @IsInt()
  @Min(1)
  number_of_persons: number;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  table_number?: string;

  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Full name can only contain letters and spaces',
  })
  reserver_name: string;

  @IsNumber()
  @Type(() => Number)
  restaurant_id: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
