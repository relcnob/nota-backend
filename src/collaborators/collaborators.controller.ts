import {
  Controller,
  UseGuards,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('lists/:listId/collaborators')
@UseGuards(AuthGuard, RolesGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  @Roles('owner')
  create(
    @Param('listId', ParseUUIDPipe) listId: string,
    @Body() dto: CreateCollaboratorDto,
  ) {
    return this.collaboratorsService.create({ ...dto, listId });
  }

  @Get()
  @Roles('owner', 'editor', 'viewer')
  findAll(@Param('listId', ParseUUIDPipe) listId: string) {
    return this.collaboratorsService.findAll(listId);
  }

  @Get(':id')
  @Roles('owner', 'editor', 'viewer')
  findOne(@Param('listId') listId: string, @Param('id') id: string) {
    return this.collaboratorsService.findOne(id, listId);
  }

  @Patch(':id')
  @Roles('owner')
  update(
    @Param('listId') listId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCollaboratorDto,
  ) {
    return this.collaboratorsService.update(id, listId, dto);
  }

  @Delete(':id')
  @Roles('owner')
  remove(@Param('listId') listId: string, @Param('id') id: string) {
    return this.collaboratorsService.remove(id, listId);
  }
}
