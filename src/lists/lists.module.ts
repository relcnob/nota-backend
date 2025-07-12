import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Collaborator } from 'src/collaborators/entities/collaborator.entity';
import { ListItem } from 'src/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, User, Collaborator, ListItem])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
