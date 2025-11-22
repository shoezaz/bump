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

export enum StolenReportStatus {
  ACTIVE = 'active',
  RECOVERED = 'recovered',
  CLOSED = 'closed',
}

@Entity('stolen_reports')
export class StolenReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Watch)
  @JoinColumn({ name: 'watchId' })
  watch: Watch;

  @Column()
  watchId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reportedById' })
  reportedBy: User;

  @Column()
  reportedById: string;

  @Column({ type: 'date' })
  theftDate: Date;

  @Column({ nullable: true })
  policeReference: string;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: StolenReportStatus,
    default: StolenReportStatus.ACTIVE,
  })
  status: StolenReportStatus;

  @Column()
  blockchainTxHash: string;

  @Column({ default: false })
  interpolNotified: boolean;

  @Column({ default: false })
  manufacturersNotified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
