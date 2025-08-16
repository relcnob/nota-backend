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
    const saved = await this.itemRepository.save(item);

    // Update the parent list's updatedAt field
    if (saved.list?.id) {
      await this.listRepository.update(
        { id: saved.list.id },
        { updatedAt: new Date() },
      );
    }

    return saved;
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
    if (!items.length) {
      throw new NotFoundException('No items provided for bulk create');
    }

    // Get unique list and user IDs
    const listIds = [...new Set(items.map((item) => item.listId))];
    const addedByIds = [...new Set(items.map((item) => item.addedById))];

    // Fetch all referenced lists and users
    const lists = await this.listRepository.find({
      where: { id: In(listIds) },
    });
    const users = await this.userRepository.find({
      where: { id: In(addedByIds) },
    });

    // Validate all lists and users exist
    if (lists.length !== listIds.length) {
      throw new NotFoundException('One or more lists not found');
    }
    if (users.length !== addedByIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    // Create items with correct relations
    const newItems = items.map((item) => {
      const list = lists.find((l) => l.id === item.listId);
      const addedBy = users.find((u) => u.id === item.addedById);
      return this.itemRepository.create({
        ...item,
        list,
        addedBy,
      });
    });

    return this.itemRepository.save(newItems);
  }

  async bulkUpdate(items: UpdateItemDto[]) {
    const itemIds = items.map((item) => item.id);
    const existingItems = await this.itemRepository.findBy({ id: In(itemIds) });

    const itemMap = new Map(existingItems.map((item) => [item.id, item]));

    const merged: ListItem[] = items
      .map((incoming) => {
        const existing = itemMap.get(incoming.id);
        if (!existing) return null;
        Object.assign(existing, incoming);
        return existing;
      })
      .filter((item): item is ListItem => item !== null);

    const saved = await this.itemRepository.save(merged);

    // Update affected lists' updatedAt field
    const affectedListIds = [
      ...new Set(saved.map((item) => item.list?.id).filter(Boolean)),
    ];
    if (affectedListIds.length > 0) {
      await this.listRepository.update(
        { id: In(affectedListIds) },
        { updatedAt: new Date() },
      );
    }

    return saved;
  }

  async bulkRemove(items: { id: string }[]) {
    if (!items.length) {
      throw new NotFoundException('No item IDs provided for bulk remove');
    }

    console.log('Bulk remove item IDs:', items);

    const result = await this.itemRepository.delete({
      id: In(items.map((item) => item.id)),
    });
    if (result.affected === 0) {
      throw new NotFoundException('No items found for the provided IDs');
    }
    return { message: 'Items deleted successfully' };
  }
}
