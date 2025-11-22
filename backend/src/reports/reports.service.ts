import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StolenReport } from './stolen-report.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(StolenReport)
    private reportsRepository: Repository<StolenReport>,
  ) {}

  async findAll(): Promise<StolenReport[]> {
    return this.reportsRepository.find({
      relations: ['watch', 'reportedBy'],
    });
  }

  async findOne(id: string): Promise<StolenReport> {
    return this.reportsRepository.findOne({
      where: { id },
      relations: ['watch', 'reportedBy'],
    });
  }

  async findByWatch(watchId: string): Promise<StolenReport[]> {
    return this.reportsRepository.find({
      where: { watchId },
      relations: ['reportedBy'],
    });
  }

  async create(reportData: Partial<StolenReport>): Promise<StolenReport> {
    const report = this.reportsRepository.create({
      ...reportData,
      blockchainTxHash: `0x${uuidv4().replace(/-/g, '')}`, // Mock blockchain hash
    });
    return this.reportsRepository.save(report);
  }

  async update(
    id: string,
    reportData: Partial<StolenReport>,
  ): Promise<StolenReport> {
    await this.reportsRepository.update(id, reportData);
    return this.findOne(id);
  }
}
