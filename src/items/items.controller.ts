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
import { BulkUpdateItemDto } from './dto/bulk-update-item.dto';
import { BulkCreateItemDto } from './dto/bulk-create-item.dto';

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

  // ╭──────────────────────────────────────────────────────────────╮
  // │                     ✨ Bulk Item Logic ✨                   │
  // ╰──────────────────────────────────────────────────────────────╯

  @Patch('bulk')
  @Roles('owner', 'editor')
  bulkUpdate(@Param('id') id: string, @Body() dto: BulkUpdateItemDto) {
    return this.itemsService.bulkUpdate(dto.items);
  }

  @Post('bulk')
  @Roles('owner', 'editor')
  bulkCreate(@Param('id') id: string, @Body() dto: BulkCreateItemDto) {
    return this.itemsService.bulkCreate(dto.items);
  }

  @Delete('bulk')
  @Roles('owner', 'editor')
  bulkRemove(
    @Param('id') id: string,
    @Body() dto: { items: { id: string }[] },
  ) {
    return this.itemsService.bulkRemove(dto.items);
  }

  // ╭──────────────────────────────────────────────────────────────╮
  // │                     ✨ ID Item Logic ✨                     │
  // ╰──────────────────────────────────────────────────────────────╯

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @Roles('owner', 'editor')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @Roles('owner', 'editor')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
