import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty()
  @IsUUID()
  watchId: string;

  @ApiProperty()
  @IsUUID()
  fromUserId: string;
}
