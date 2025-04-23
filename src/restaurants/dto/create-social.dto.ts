import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SocialPlatform } from '../entities/restaurant-socials.entity'; // Adjust the import path as necessary

export class CreateSocialDto {
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsNotEmpty()
  @IsString()
  url: string;
}
