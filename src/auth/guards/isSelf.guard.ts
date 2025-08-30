import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class IsSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramUserId = request.params.id;

    if (!user || !paramUserId || user.id !== paramUserId) {
      throw new ForbiddenException('You can only access your own user data');
    }
    return true;
  }
}
