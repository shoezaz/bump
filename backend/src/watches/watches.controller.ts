import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WatchesService } from './watches.service';
import { Watch } from './watch.entity';
import { WatchHistory } from './watch-history.entity';

@ApiTags('watches')
@Controller('watches')
export class WatchesController {
  constructor(private readonly watchesService: WatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all watches' })
  findAll(@Query('ownerId') ownerId?: string): Promise<Watch[]> {
    if (ownerId) {
      return this.watchesService.findByOwner(ownerId);
    }
    return this.watchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get watch by ID' })
  findOne(@Param('id') id: string): Promise<Watch> {
    return this.watchesService.findOne(id);
  }

  @Get('serial/:serialNumber')
  @ApiOperation({ summary: 'Get watch by serial number' })
  findBySerialNumber(
    @Param('serialNumber') serialNumber: string,
  ): Promise<Watch> {
    return this.watchesService.findBySerialNumber(serialNumber);
  }

  @Post()
  @ApiOperation({ summary: 'Register new watch' })
  create(@Body() watchData: Partial<Watch>): Promise<Watch> {
    return this.watchesService.create(watchData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update watch' })
  update(
    @Param('id') id: string,
    @Body() watchData: Partial<Watch>,
  ): Promise<Watch> {
    return this.watchesService.update(id, watchData);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get watch history' })
  getHistory(@Param('id') id: string): Promise<WatchHistory[]> {
    return this.watchesService.getHistory(id);
  }

  @Post(':id/history')
  @ApiOperation({ summary: 'Add history event' })
  addHistory(
    @Param('id') id: string,
    @Body() historyData: Partial<WatchHistory>,
  ): Promise<WatchHistory> {
    return this.watchesService.addHistory({ ...historyData, watchId: id });
  }
}
