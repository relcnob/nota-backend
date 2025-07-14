import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Load the user with isActive check
      const user = await this.userRepo.findOne({
        where: { id: payload.id, isActive: true }, // ✅ filter by active status
        select: ['id', 'email', 'username', 'isActive'],
        relations: ['collaborations', 'lists'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      request.user = user;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
