import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { List } from 'src/lists/entities/list.entity';
import { Collaborator } from 'src/collaborators/entities/collaborator.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, List, Collaborator])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
