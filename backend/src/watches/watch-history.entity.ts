import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Watch } from './watch.entity';
import { User } from '../users/user.entity';

export enum EventType {
  PURCHASE = 'purchase',
  SERVICE = 'service',
  TRANSFER = 'transfer',
  MODIFICATION = 'modification',
  ALERT = 'alert',
  STOLEN_REPORT = 'stolen_report',
}

@Entity('watch_history')
export class WatchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Watch, (watch) => watch.history)
  @JoinColumn({ name: 'watchId' })
  watch: Watch;

  @Column()
  watchId: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  entityName: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'entityId' })
  entity: User;

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'jsonb', nullable: true })
  documents: object;

  @Column({ nullable: true })
  blockchainHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
