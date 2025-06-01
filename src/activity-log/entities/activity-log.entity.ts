import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ShoppingList } from '../../lists/entities/list.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShoppingList, { onDelete: 'CASCADE' })
  list: ShoppingList;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column()
  action: string;

  @Column({ nullable: true })
  itemId: string;

  @CreateDateColumn()
  timestamp: Date;
}
