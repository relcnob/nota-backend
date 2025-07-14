import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Collaborator } from 'src/collaborators/entities/collaborator.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListItem } from 'src/items/entities/item.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @InjectRepository(Collaborator)
    private readonly collabRepo: Repository<Collaborator>,

    @InjectRepository(List)
    private readonly listRepo: Repository<List>,

    @InjectRepository(ListItem)
    private readonly itemRepo: Repository<ListItem>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const isItemRoute = request.route.path.includes('/items/:id');
    const isListRoute = request.route.path.includes('/lists/:id');

    let listId: string | undefined;

    if (isItemRoute) {
      const itemId = request.params.id;
      const item = await this.itemRepo.findOne({
        where: { id: itemId },
        relations: ['list'],
      });

      if (!item || !item.list) {
        throw new ForbiddenException('Item or its list not found');
      }

      listId = item.list.id;
    } else if (isListRoute) {
      listId = request.params.id;
    } else {
      listId = request.params.listId || request.params.id;
    }

    if (!user || !listId) return false;

    const list = await this.listRepo.findOneBy({ id: listId });
    if (list?.ownerId === user.id) return true;

    const collab = await this.collabRepo.findOneBy({
      userId: user.id,
      listId,
    });

    if (!collab) {
      throw new ForbiddenException('You are not a collaborator on this list');
    }

    if (!requiredRoles.includes(collab.role)) {
      throw new ForbiddenException(
        `You need to be one of: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
