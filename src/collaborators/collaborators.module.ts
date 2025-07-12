import { Module } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Collaborator } from './entities/collaborator.entity';
import { ListItem } from 'src/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, List, Collaborator, ListItem])],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService],
})
export class CollaboratorsModule {}
