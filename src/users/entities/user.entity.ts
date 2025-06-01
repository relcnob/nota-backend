import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
} from 'typeorm';
import { ShoppingList } from '../../lists/entities/list.entity';
import { ListItem } from '../../items/entities/item.entity';
import { Collaborator } from '../../collaborators/entities/collaborator.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @OneToMany(() => ShoppingList, (list) => list.owner)
  lists: ShoppingList[];

  @OneToMany(() => ListItem, (item) => item.addedBy)
  items: ListItem[];

  @OneToMany(() => Collaborator, (collab) => collab.user)
  collaborations: Collaborator[];

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
