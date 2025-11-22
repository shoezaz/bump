import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Watch } from '../watches/watch.entity';
import { Transfer } from '../transfers/transfer.entity';

export enum UserType {
  COLLECTOR = 'collector',
  DEALER = 'dealer',
  EXPERT = 'expert',
}

export enum KYCStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING,
  })
  kycStatus: KYCStatus;

  @Column({ nullable: true })
  kycVerifiedAt: Date;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.COLLECTOR,
  })
  userType: UserType;

  @Column({ default: 0 })
  reputationScore: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, length: 2 })
  countryCode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Watch, (watch) => watch.currentOwner)
  watches: Watch[];

  @OneToMany(() => Transfer, (transfer) => transfer.fromUser)
  transfersFrom: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.toUser)
  transfersTo: Transfer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
