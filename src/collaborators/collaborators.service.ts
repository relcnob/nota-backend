import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborator } from './entities/collaborator.entity';
import { User } from 'src/users/entities/user.entity';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class CollaboratorsService {
  constructor(
    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(List)
    private readonly listRepo: Repository<List>,
  ) {}

  async create(dto: CreateCollaboratorDto & { listId: string }) {
    const { userId, listId, role } = dto;

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const list = await this.listRepo.findOneBy({ id: listId });
    if (!list) throw new NotFoundException(`List ${listId} not found`);

    const existing = await this.collaboratorRepo.findOneBy({ userId, listId });
    if (existing) {
      throw new ConflictException(
        `User ${userId} is already a collaborator on list ${listId}`,
      );
    }

    const collab = this.collaboratorRepo.create({ user, list, role });
    return this.collaboratorRepo.save(collab);
  }

  async createByEmail(
    dto: Partial<CreateCollaboratorDto> & { email: string; listId: string },
  ) {
    const { email, listId, role } = dto;

    const user = await this.userRepo.findOneBy({ email });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    const list = await this.listRepo.findOneBy({ id: listId });
    if (!list) throw new NotFoundException(`List ${listId} not found`);

    const existing = await this.collaboratorRepo.findOneBy({
      userId: user.id,
      listId,
    });
    if (existing) {
      throw new ConflictException(
        `User ${user.id} is already a collaborator on list ${listId}`,
      );
    }

    const collab = this.collaboratorRepo.create({ user, list, role });
    return this.collaboratorRepo.save(collab);
  }

  async findAll(listId: string) {
    return this.collaboratorRepo.find({
      where: { listId },
      relations: ['user'],
    });
  }

  async findOne(id: string, listId: string) {
    const collab = await this.collaboratorRepo.findOne({
      where: { id, listId },
      relations: ['user'],
    });

    if (!collab) {
      throw new NotFoundException(
        `Collaborator ${id} not found in list ${listId}`,
      );
    }

    return collab;
  }

  async update(id: string, listId: string, dto: UpdateCollaboratorDto) {
    const collab = await this.findOne(id, listId);
    Object.assign(collab, dto);
    return this.collaboratorRepo.save(collab);
  }

  async remove(id: string, listId: string) {
    const existing = await this.findOne(id, listId);
    await this.collaboratorRepo.remove(existing);
    return { message: `Collaborator ${id} removed from list ${listId}` };
  }
}
