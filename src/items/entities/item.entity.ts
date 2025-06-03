import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { List } from '../../lists/entities/list.entity';

@Entity('list_items')
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  purchased: boolean;

  @Column({ type: 'timestamp', nullable: true })
  purchasedAt: Date;

  @ManyToOne(() => List, (list) => list.items, { onDelete: 'CASCADE' })
  list: List;

  @ManyToOne(() => User, (user) => user.items, { nullable: true })
  addedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
