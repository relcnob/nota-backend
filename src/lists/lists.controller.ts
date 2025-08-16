import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createListDto: CreateListDto) {
    console.log('Creating list with data:', createListDto);
    return this.listsService.create(createListDto);
  }

  @Get()
  @HttpCode(200)
  findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.listsService.findAll(String(req.user.id), +page, +limit);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles('owner', 'editor', 'viewer')
  findOne(@Param('id') id: string) {
    return this.listsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('owner', 'editor')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, updateListDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('owner', 'editor')
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }
}
