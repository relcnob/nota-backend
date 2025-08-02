import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  // ╭──────────────────────────────────────────────────────────────╮
  // │                     ✨ Bulk Item Logic ✨                   │
  // ╰──────────────────────────────────────────────────────────────╯

  async bulkCreate(items: CreateItemDto[]) {
    const listIds = items.map((item) => item.listId);
    const lists = await this.listRepository.find({
      where: { id: In(listIds) },
    });

    if (lists.length !== listIds.length) {
      throw new NotFoundException('One or more lists not found');
    }

    const addedByIds = items.map((item) => item.addedById);
    const addedByUsers = await this.userRepository.find({
      where: { id: In(addedByIds) },
    });

    if (addedByUsers.length !== addedByIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    const newItems = items.map((item) => {
      const list = lists.find((l) => l.id === item.listId);
      const addedBy = addedByUsers.find((u) => u.id === item.addedById);
      return this.itemRepository.create({
        ...item,
        list,
        addedBy,
      });
    });

    return this.itemRepository.save(newItems);
  }

  async bulkUpdate(items: UpdateItemDto[]) {
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const existingItem = await this.findOne(item.id);
        Object.assign(existingItem, item);
        return this.itemRepository.save(existingItem);
      }),
    );
    return updatedItems;
  }
}
