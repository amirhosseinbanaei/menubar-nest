import {
  IsEnum,
  IsString,
  IsBoolean,
  Matches,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WeekDay } from '../entities/restaurant-hours.entity';

export class CreateWorkingHourDto {
  @IsEnum(WeekDay)
  day: WeekDay;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:mm (24-hour)',
  })
  open_time: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:mm (24-hour)',
  })
  close_time: string;

  @IsBoolean()
  is_open: boolean;
}

export class CreateRestaurantHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHourDto)
  working_hours: CreateWorkingHourDto[];
}
