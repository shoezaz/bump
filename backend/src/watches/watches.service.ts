import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watch } from './watch.entity';
import { WatchHistory } from './watch-history.entity';

@Injectable()
export class WatchesService {
  constructor(
    @InjectRepository(Watch)
    private watchesRepository: Repository<Watch>,
    @InjectRepository(WatchHistory)
    private historyRepository: Repository<WatchHistory>,
  ) {}

  async findAll(): Promise<Watch[]> {
    return this.watchesRepository.find({
      relations: ['currentOwner', 'history'],
    });
  }

  async findOne(id: string): Promise<Watch> {
    return this.watchesRepository.findOne({
      where: { id },
      relations: ['currentOwner', 'history'],
    });
  }

  async findByOwner(ownerId: string): Promise<Watch[]> {
    return this.watchesRepository.find({
      where: { currentOwnerId: ownerId },
      relations: ['history'],
    });
  }

  async findBySerialNumber(serialNumber: string): Promise<Watch> {
    return this.watchesRepository.findOne({
      where: { serialNumber },
      relations: ['currentOwner', 'history'],
    });
  }

  async create(watchData: Partial<Watch>): Promise<Watch> {
    const watch = this.watchesRepository.create(watchData);
    return this.watchesRepository.save(watch);
  }

  async update(id: string, watchData: Partial<Watch>): Promise<Watch> {
    await this.watchesRepository.update(id, watchData);
    return this.findOne(id);
  }

  async addHistory(historyData: Partial<WatchHistory>): Promise<WatchHistory> {
    const history = this.historyRepository.create(historyData);
    return this.historyRepository.save(history);
  }

  async getHistory(watchId: string): Promise<WatchHistory[]> {
    return this.historyRepository.find({
      where: { watchId },
      order: { eventDate: 'DESC' },
    });
  }
}
