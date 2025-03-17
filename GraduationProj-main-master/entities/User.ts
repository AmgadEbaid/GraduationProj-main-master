import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  // This attribute indicte whether the user signed up with the OTP successfully or not
  @Column({ default: false })
  status: boolean;

  @Column()
  phone: string;

  // Flag to indicate if the user was created via OAuth (Google, etc.)
  @Column({ default: false })
  isOAuthUser: boolean;
}
