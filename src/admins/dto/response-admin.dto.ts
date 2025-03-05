import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class AdminResponseDto {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  national_number: string;

  @Expose()
  phone_number: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
