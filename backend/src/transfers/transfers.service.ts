import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer, TransferStatus } from './transfer.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer)
    private transfersRepository: Repository<Transfer>,
  ) {}

  async findAll(): Promise<Transfer[]> {
    return this.transfersRepository.find({
      relations: ['watch', 'fromUser', 'toUser'],
    });
  }

  async findOne(id: string): Promise<Transfer> {
    return this.transfersRepository.findOne({
      where: { id },
      relations: ['watch', 'fromUser', 'toUser'],
    });
  }

  async findByToken(qrToken: string): Promise<Transfer> {
    return this.transfersRepository.findOne({
      where: { qrToken },
      relations: ['watch', 'fromUser', 'toUser'],
    });
  }

  async create(transferData: Partial<Transfer>): Promise<Transfer> {
    const transfer = this.transfersRepository.create({
      ...transferData,
      qrToken: uuidv4(),
      qrExpiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });
    return this.transfersRepository.save(transfer);
  }

  async updateStatus(
    id: string,
    status: TransferStatus,
    toUserId?: string,
  ): Promise<Transfer> {
    const updateData: any = { status };
    if (status === TransferStatus.ACCEPTED) {
      updateData.completedAt = new Date();
      if (toUserId) {
        updateData.toUserId = toUserId;
      }
    }
    await this.transfersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async checkExpired(qrToken: string): Promise<boolean> {
    const transfer = await this.findByToken(qrToken);
    if (!transfer) return true;
    return new Date() > transfer.qrExpiresAt;
  }
}
