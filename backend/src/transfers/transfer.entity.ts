import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Watch } from '../watches/watch.entity';
import { User } from '../users/user.entity';

export enum TransferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Watch, (watch) => watch.transfers)
  @JoinColumn({ name: 'watchId' })
  watch: Watch;

  @Column()
  watchId: string;

  @ManyToOne(() => User, (user) => user.transfersFrom)
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @Column()
  fromUserId: string;

  @ManyToOne(() => User, (user) => user.transfersTo, { nullable: true })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Column({ nullable: true })
  toUserId: string;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.PENDING,
  })
  status: TransferStatus;

  @Column({ unique: true })
  qrToken: string;

  @Column()
  qrExpiresAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  blockchainTxHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
