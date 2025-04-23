import { Expose, Transform, Type } from 'class-transformer';
import { LanguageDto } from 'src/languages/dto/language.dto';
import { ResponseLanguageDto } from 'src/languages/dto/response-language.dto';
import { DetailTranslationDto } from 'src/languages/dto/translation.dto';

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
  @Expose()
  id: number;

  @Expose()
  logo: string;

  @Expose()
  created_at: Date;

  @Expose()
  color_palette_id: number;

  @Expose()
  @Type(() => ResponseLanguageDto)
  languages: ResponseLanguageDto[];

  @Expose()
  @Type(() => DetailTranslationDto)
  translations: DetailTranslationDto[];

  @Expose()
  @Type(() => WorkingHourResponseDto)
  workingHours: WorkingHourResponseDto[];

  @Expose()
  @Type(() => SocialMediaResponseDto)
  socials: SocialMediaResponseDto[];
}

export class RestaurantsResponseDto {
  @Expose()
  id: number;

  @Expose()
  logo: string;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => LanguageDto)
  @Transform(
    ({ obj }) => obj.languages.map((l: LanguageDto) => l.language_code),
    {
      toPlainOnly: true,
    },
  )
  languages: string[];

  @Expose()
  @Type(() => DetailTranslationDto)
  translations: DetailTranslationDto[];

  @Expose()
  @Type(() => WorkingHourResponseDto)
  working_hours: WorkingHourResponseDto[];

  @Expose()
  @Type(() => SocialMediaResponseDto)
  socials: SocialMediaResponseDto[];
}
