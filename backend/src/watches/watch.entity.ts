import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Transfer } from '../transfers/transfer.entity';
import { WatchHistory } from './watch-history.entity';

export enum WatchStatus {
  CERTIFIED = 'certified',
  WARNING = 'warning',
  STOLEN = 'stolen',
  MODIFIED = 'modified',
}

@Entity('watches')
export class Watch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serialNumber: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({
    type: 'enum',
    enum: WatchStatus,
    default: WatchStatus.CERTIFIED,
  })
  status: WatchStatus;

  @Column({ nullable: true })
  blockchainHash: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.watches)
  @JoinColumn({ name: 'currentOwnerId' })
  currentOwner: User;

  @Column()
  currentOwnerId: string;

  @OneToMany(() => Transfer, (transfer) => transfer.watch)
  transfers: Transfer[];

  @OneToMany(() => WatchHistory, (history) => history.watch)
  history: WatchHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
