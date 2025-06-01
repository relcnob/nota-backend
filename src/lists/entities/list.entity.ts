import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../items/entities/item.entity';
import { Collaborator } from '../../collaborators/entities/collaborator.entity';

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.lists, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => ListItem, (item) => item.list)
  items: ListItem[];

  @OneToMany(() => Collaborator, (collab) => collab.list)
  collaborators: Collaborator[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
