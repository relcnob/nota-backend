import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  id: string;
  name?: string;
  quantity?: number;
  category?: string;
  notes?: string;
  completed?: boolean;
  completedAt?: Date;
  listId?: string;
  addedById?: string;
}
