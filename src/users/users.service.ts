import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, In, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SafeUser } from 'src/auth/auth.type';
import { List } from 'src/lists/entities/list.entity';
import { Collaborator } from 'src/collaborators/entities/collaborator.entity';

type DashboardMetricsResponse = {
  TotalLists: number;
  UpdatedInPastDay: number;
  CollaboratedOn: number;
  CreatedByUser: number;
  RecentlyUpdatedLists: List[];
  CommonCollaborators: Partial<User>[];
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(List) private listRepository: Repository<List>,
    @InjectRepository(Collaborator)
    private collaboratorRepository: Repository<Collaborator>,
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

  async findAll() {
    return this.userRepository.find({
      where: { isActive: true },
      select: ['username', 'email'],
    });
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

  async findDashboardMetrics(id: string): Promise<DashboardMetricsResponse> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    let TotalLists = 0;
    let UpdatedInPastDay = 0;
    let CollaboratedOn = 0;
    let CreatedByUser = 0;
    let RecentlyUpdatedLists: List[] = [];
    let CommonCollaborators: Partial<User>[] = [];

    const collaborations = await this.collaboratorRepository.find({
      where: { userId: foundUser.id },
      relations: ['list'],
    });

    const listsCreatedByUser = await this.listRepository.find({
      where: { ownerId: foundUser.id },
    });

    const ownedListsUpdatedInPastDay = await this.listRepository.find({
      where: {
        ownerId: foundUser.id,
        updatedAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)),
      },
    });

    const collaborators = await this.collaboratorRepository.find({
      where: {
        userId: foundUser.id,
        list: {
          updatedAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)),
        },
      },
      relations: ['list'],
    });
    const sharedListsUpdatedInPastDay = collaborators
      .map((collaborator) => collaborator.list)
      .filter(Boolean);

    const listsUpdatedInPastDay = [
      ...ownedListsUpdatedInPastDay,
      ...sharedListsUpdatedInPastDay,
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const listsCollaboratedOn = collaborations
      .map((collaboration) => collaboration.list)
      .filter(Boolean);

    const recentlyUpdated = [
      ...listsCollaboratedOn,
      ...listsCreatedByUser,
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const collaboratorsOnUserListsRaw = await this.collaboratorRepository.find({
      where: {
        list: {
          id: In(listsCreatedByUser.map((list) => list.id)),
        },
      },
      relations: ['user'],
    });
    const collaboratorsOnUserLists = collaboratorsOnUserListsRaw
      .map((collab) => collab.user)
      .filter(Boolean);

    let ownersOfListsCollaboratedOn: Partial<User>[] = [];
    if (listsCollaboratedOn.length > 0) {
      const listsCollaboratedOnEntities = await this.listRepository.find({
        where: {
          id: In(listsCollaboratedOn.map((list) => list.id)),
        },
        relations: ['owner'],
      });
      ownersOfListsCollaboratedOn = listsCollaboratedOnEntities
        .map((list) => list.owner)
        .filter(Boolean);
    }

    const commonCollaborators = [
      ...collaboratorsOnUserLists,
      ...ownersOfListsCollaboratedOn,
    ];

    const uniqueCollaborators = Object.values(
      commonCollaborators.reduce(
        (acc, user) => {
          if (user && user.id) acc[user.id] = user;
          return acc;
        },
        {} as Record<string, Partial<User>>,
      ),
    );

    TotalLists = listsCreatedByUser.length + collaborations.length;
    UpdatedInPastDay = listsUpdatedInPastDay.length;
    CollaboratedOn = collaborations.length;
    CreatedByUser = listsCreatedByUser.length;
    RecentlyUpdatedLists = recentlyUpdated.slice(0, 5);
    CommonCollaborators = uniqueCollaborators;

    return {
      TotalLists,
      UpdatedInPastDay,
      CollaboratedOn,
      CreatedByUser,
      RecentlyUpdatedLists,
      CommonCollaborators,
    };
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
