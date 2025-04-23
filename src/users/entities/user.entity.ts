import { Order } from 'src/orders/entities/order.entity';
import { TableReservation } from 'src/reservations/entities/reservation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  full_name: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otp_expiry: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => TableReservation, (t) => t.user)
  reservations: TableReservation[];

  @OneToMany(() => Order, (order) => order.user, { nullable: false })
  orders: Order[];

  // Helper methods
  isOtpValid(): boolean {
    if (!this.otp || !this.otp_expiry) {
      return false;
    }
    return new Date() <= this.otp_expiry;
  }

  clearOtp(): void {
    this.otp = null;
    this.otp_expiry = null;
  }

  setOtp(otp: string, expiryMinutes: number = 3): void {
    this.otp = otp;
    this.otp_expiry = new Date(Date.now() + expiryMinutes * 60000);
  }
}
