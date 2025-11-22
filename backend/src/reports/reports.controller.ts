import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { StolenReport } from './stolen-report.entity';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stolen reports' })
  findAll(): Promise<StolenReport[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  findOne(@Param('id') id: string): Promise<StolenReport> {
    return this.reportsService.findOne(id);
  }

  @Get('watch/:watchId')
  @ApiOperation({ summary: 'Get reports for a watch' })
  findByWatch(@Param('watchId') watchId: string): Promise<StolenReport[]> {
    return this.reportsService.findByWatch(watchId);
  }

  @Post()
  @ApiOperation({ summary: 'Create stolen report' })
  create(@Body() reportData: Partial<StolenReport>): Promise<StolenReport> {
    return this.reportsService.create(reportData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update report' })
  update(
    @Param('id') id: string,
    @Body() reportData: Partial<StolenReport>,
  ): Promise<StolenReport> {
    return this.reportsService.update(id, reportData);
  }
}
