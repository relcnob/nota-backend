import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SafeUser } from 'src/auth/auth.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const existingUserEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    const existingUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (existingUserEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    if (existingUsername) {
      throw new BadRequestException('User with this username already exists');
    }

    const newUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(newUser);

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    const foundUser = await this.userRepository.findOneBy({ email });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    // changed from .update to .save to trigger BeforeUpdate hook (normalization in user.entity.ts)
    const userToSave = this.userRepository.create({
      ...foundUser,
      ...updateUserDto,
    });
    return await this.userRepository.save(userToSave);
  }

  async remove(id: string): Promise<DeleteResult> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.delete(id);
  }
}
