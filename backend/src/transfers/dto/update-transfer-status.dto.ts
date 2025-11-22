import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransferStatus } from '../transfer.entity';

export class UpdateTransferStatusDto {
  @ApiProperty({ enum: TransferStatus })
  @IsEnum(TransferStatus)
  status: TransferStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  toUserId?: string;
}
