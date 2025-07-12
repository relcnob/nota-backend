import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Collaborator } from 'src/collaborators/entities/collaborator.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @InjectRepository(Collaborator)
    private readonly collabRepo: Repository<Collaborator>,

    @InjectRepository(List)
    private readonly listRepo: Repository<List>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const listId = request.params.listId;

    if (!user || !listId) return false;

    // Check if user is owner of the list
    const list = await this.listRepo.findOneBy({ id: listId });
    if (list?.ownerId === user.id) return true;

    // Check if user is a collaborator with the right role
    const collab = await this.collabRepo.findOneBy({
      userId: user.id,
      listId,
    });

    if (!collab) {
      throw new ForbiddenException('You are not a collaborator on this list');
    }

    if (requiredRoles.includes(collab.role)) {
      return true;
    }

    throw new ForbiddenException(
      `You need one of: ${requiredRoles.join(', ')}`,
    );
  }
}
