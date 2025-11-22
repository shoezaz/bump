import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { Transfer, TransferStatus } from './transfer.entity';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transfers' })
  findAll(): Promise<Transfer[]> {
    return this.transfersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transfer by ID' })
  findOne(@Param('id') id: string): Promise<Transfer> {
    return this.transfersService.findOne(id);
  }

  @Get('token/:token')
  @ApiOperation({ summary: 'Get transfer by QR token' })
  findByToken(@Param('token') token: string): Promise<Transfer> {
    return this.transfersService.findByToken(token);
  }

  @Post()
  @ApiOperation({ summary: 'Create new transfer' })
  create(@Body() transferData: Partial<Transfer>): Promise<Transfer> {
    return this.transfersService.create(transferData);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update transfer status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TransferStatus; toUserId?: string },
  ): Promise<Transfer> {
    return this.transfersService.updateStatus(id, body.status, body.toUserId);
  }
}
