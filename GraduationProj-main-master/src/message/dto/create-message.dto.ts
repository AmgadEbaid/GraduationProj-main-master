import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  message: string; // The message content
  @IsNotEmpty()
  chatId: string; // The ID of the chat to which the message belongs=
}
