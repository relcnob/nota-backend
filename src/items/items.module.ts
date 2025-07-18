import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItem } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { List } from 'src/lists/entities/list.entity';
import { Collaborator } from 'src/collaborators/entities/collaborator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListItem, User, List, Collaborator])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
