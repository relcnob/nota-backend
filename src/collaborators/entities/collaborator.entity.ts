import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { List } from '../../lists/entities/list.entity';

@Entity('list_collaborators')
@Unique(['user', 'list']) // ensures a user can't collaborate twice on the same list
export class Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.collaborations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  readonly userId: string;

  @ManyToOne(() => List, (list) => list.collaborators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listId' })
  list: List;

  @Column()
  readonly listId: string;

  @Column({ type: 'varchar', default: 'viewer' })
  role: 'viewer' | 'editor';

  @CreateDateColumn()
  addedAt: Date;
}
