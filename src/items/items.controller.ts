import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':listId')
  findOne(@Param('listId') listId: string) {
    return this.itemsService.findOne(listId);
  }

  @Patch(':listId')
  @Roles('owner', 'editor')
  update(
    @Param('listId') listId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(listId, updateItemDto);
  }

  @Delete(':listId')
  @Roles('owner', 'editor')
  remove(@Param('listId') listId: string) {
    return this.itemsService.remove(listId);
  }
}
