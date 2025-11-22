import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWatchDto {
  @ApiProperty({ example: '8273X92L' })
  @IsString()
  @MinLength(4)
  serialNumber: string;

  @ApiProperty({ example: 'Rolex' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Cosmograph Daytona' })
  @IsString()
  model: string;

  @ApiPropertyOptional({ example: '116500LN' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: 2021 })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({ example: 28500.0 })
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @ApiPropertyOptional({ example: 14500.0 })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty()
  @IsUUID()
  currentOwnerId: string;
}
