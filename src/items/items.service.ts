import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ListItem } from './entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly itemRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const list = await this.listRepository.findOneBy({
      id: createItemDto.listId,
    });

    if (!list) {
      throw new NotFoundException(
        `List with ID ${createItemDto.listId} not found`,
      );
    }

    const addedBy = await this.userRepository.findOneBy({
      id: createItemDto.addedById,
    });

    if (!addedBy) {
      throw new NotFoundException(
        `User with ID ${createItemDto.listId} not found`,
      );
    }

    const item = this.itemRepository.create({
      name: createItemDto.name,
      quantity: createItemDto.quantity,
      category: createItemDto.category,
      notes: createItemDto.notes,
      completed: createItemDto.completed,
      completedAt: createItemDto.completedAt,
      list,
      addedBy,
    });

    return this.itemRepository.save(item);
  }

  async findAll() {
    const items = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.list', 'list')
      .leftJoin('item.addedBy', 'user')
      .addSelect(['user.id', 'user.username', 'user.email'])
      .getMany();

    if (items.length === 0) {
      throw new NotFoundException('No items found');
    }
    return items;
  }

  async findOne(id: string) {
    const item = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.list', 'list')
      .leftJoin('item.addedBy', 'user')
      .addSelect(['user.id', 'user.username', 'user.email'])
      .where('item.id = :id', { id })
      .getOne();

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(id); // will throw if not found
    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async remove(id: string) {
    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return { message: `Item with ID ${id} deleted successfully` };
  }
}
