import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  phone_number: string;

  @Expose()
  is_verified: boolean;

  @Expose()
  created_at: Date;
}
