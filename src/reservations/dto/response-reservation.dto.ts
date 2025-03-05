import { Expose, Transform } from 'class-transformer';

export class ReservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => value.toISOString().split('T')[0])
  reservation_date: Date;

  @Expose()
  start_time: string;

  @Expose()
  duration_minutes: number;

  @Expose()
  number_of_persons: number;

  @Expose()
  table_number: string;

  @Expose()
  reserver_name: string;

  @Expose()
  status: string;

  @Expose()
  notes: string;

  @Expose()
  created_at: Date;

  @Expose()
  @Transform(({ obj }) => ({
    id: obj.restaurant?.id,
    name: obj.restaurant?.name,
  }))
  restaurant: { id: number; name: string };

  @Expose()
  @Transform(({ obj }) =>
    obj.user
      ? {
          id: obj.user?.id,
          phone_number: obj.user?.phone_number,
        }
      : null,
  )
  user: { id: number; phone_number: string } | null;
}
