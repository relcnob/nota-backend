import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { List } from '../../lists/entities/list.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  list: List;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column()
  action: string;

  @Column({ nullable: true })
  itemId: string;

  @CreateDateColumn()
  timestamp: Date;
}
