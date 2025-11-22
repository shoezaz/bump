import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStolenReportDto {
  @ApiProperty()
  @IsUUID()
  watchId: string;

  @ApiProperty()
  @IsUUID()
  reportedById: string;

  @ApiProperty({ example: '2025-11-20' })
  @IsDateString()
  theftDate: Date;

  @ApiPropertyOptional({ example: 'POL-2025-123456' })
  @IsOptional()
  @IsString()
  policeReference?: string;

  @ApiPropertyOptional({ example: 'Paris, France' })
  @IsOptional()
  @IsString()
  location?: string;
}
