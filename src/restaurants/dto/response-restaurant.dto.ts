import { Expose, Type } from 'class-transformer';

class WorkingHourResponseDto {
  @Expose()
  day: string;

  @Expose()
  open_time: string;

  @Expose()
  close_time: string;

  @Expose()
  is_open: boolean;
}

class SocialMediaResponseDto {
  @Expose()
  platform: string;

  @Expose()
  url: string;
}

export class RestaurantResponseDto {
  // ... existing restaurant fields

  @Expose()
  @Type(() => WorkingHourResponseDto)
  working_hours: WorkingHourResponseDto[];

  @Expose()
  @Type(() => SocialMediaResponseDto)
  socials: SocialMediaResponseDto[];
}
