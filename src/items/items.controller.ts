import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
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
  @HttpCode(201)
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.itemsService.findAll();
  }

  // ╭──────────────────────────────────────────────────────────────╮
  // │                     ✨ Bulk Item Logic ✨                   │
  // ╰──────────────────────────────────────────────────────────────╯

  @Patch('bulk')
  @HttpCode(200)
  @Roles('owner', 'editor')
  bulkUpdate(@Param('id') id: string, @Body() dto: BulkUpdateItemDto) {
    return this.itemsService.bulkUpdate(dto.items);
  }

  @Post('bulk')
  @HttpCode(200)
  @Roles('owner', 'editor')
  bulkCreate(@Param('id') id: string, @Body() dto: BulkCreateItemDto) {
    return this.itemsService.bulkCreate(dto.items);
  }

  @Delete('bulk')
  @HttpCode(204)
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
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('owner', 'editor')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('owner', 'editor')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
