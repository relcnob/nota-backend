import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Collaborator } from 'src/collaborators/entities/collaborator.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private listRepository: Repository<List>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
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

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Lists the user owns
    const ownedLists = await this.listRepository.find({
      where: { ownerId: userId },
      relations: ['owner', 'collaborators', 'collaborators.user', 'items'],
    });

    // Lists the user collaborates on
    const collaborators = await this.collaboratorRepo.find({
      where: { userId },
      relations: ['list', 'list.owner', 'list.items'],
    });

    const collaboratorLists = collaborators.map((collab) => collab.list);

    // Merge and deduplicate by ID (in case the user is both owner and collaborator)
    const allLists = [...ownedLists, ...collaboratorLists];
    const uniqueLists = Object.values(
      Object.fromEntries(allLists.map((l) => [l.id, l])),
    );

    // Paginate the results
    const [lists, total] = await this.listRepository.findAndCount({
      where: { id: In(uniqueLists.map((list) => list.id)) },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['owner', 'collaborators', 'collaborators.user', 'items'],
      cache: true,
    });

    return {
      lists: lists,
      meta: {
        page,
        limit,
        totalLists: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.listRepository
      .findOne({
        where: { id },
        relations: ['owner', 'collaborators', 'collaborators.user', 'items'],
      })
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
    Object.assign(list, { updatedAt: new Date() });
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
