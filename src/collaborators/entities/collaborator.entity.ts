import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ShoppingList } from '../../lists/entities/list.entity';

@Entity('list_collaborators')
@Unique(['user', 'list'])
export class Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.collaborations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ShoppingList, (list) => list.collaborators, {
    onDelete: 'CASCADE',
  })
  list: ShoppingList;

  @Column({ type: 'varchar', default: 'viewer' })
  role: 'viewer' | 'editor';

  @CreateDateColumn()
  addedAt: Date;
}
