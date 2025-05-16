import { IsNotEmpty } from 'class-validator';

export class UpdateFcmTokenDto {
  @IsNotEmpty({ message: 'FCM token is required' })
  fcmToken: string;
}
