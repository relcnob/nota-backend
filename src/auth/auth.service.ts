import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signup(signupDTO: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.create(signupDTO);
    if (!createdUser) {
      throw new BadRequestException('Error creating user');
    }
    return createdUser;
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: User; token: string }> {
    const foundUser = await this.userService.findOneByEmail(email);
    if (!foundUser || !foundUser.comparePassword(password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //   check for inactive account (instead of deleting account Admin should be able to deactivate it)
    if (!foundUser.isActive) {
      throw new UnauthorizedException('Inactive account');
    }
    const payload = {
      email: foundUser.email,
      id: foundUser.id,
      username: foundUser.username,
    };
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return {
      user: foundUser,
      token: jwt.sign(payload, jwtSecret),
    };
  }

  refreshToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(user, jwtSecret);
  }
}
