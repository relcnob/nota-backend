import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private listRepository: Repository<List>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createListDto: CreateListDto) {
    const user = await this.userRepository.findOneBy({
      id: createListDto.ownerId,
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createListDto.ownerId} not found`,
      );
    }

    const newList = this.listRepository.create({
      ...createListDto,
      owner: user, // ensure relation is set
    });

    return this.listRepository.save(newList);
  }

  findAll() {
    return this.listRepository.find({ relations: ['owner'] });
  }

  findOne(id: string) {
    return this.listRepository
      .findOne({ where: { id }, relations: ['owner'] })
      .then((list) => {
        if (!list) {
          throw new NotFoundException(`List with ID ${id} not found`);
        }
        return list;
      });
  }

  async update(id: string, updateListDto: UpdateListDto) {
    const list = await this.listRepository.findOneBy({ id });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    // Optional: Validate ownerId if it’s being updated
    if (updateListDto.ownerId) {
      const user = await this.userRepository.findOneBy({
        id: updateListDto.ownerId,
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateListDto.ownerId} not found`,
        );
      }

      // Set the owner relation if user is valid
      list.owner = user;
    }

    Object.assign(list, updateListDto);
    return this.listRepository.save(list);
  }

  remove(id: string) {
    return this.listRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      return { message: `List with ID ${id} deleted successfully` };
    });
  }
}
