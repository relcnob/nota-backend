import { UpdateItemDto } from './update-item.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class ItemUpdateWithId extends UpdateItemDto {
  @IsUUID()
  id: string;
}

export class BulkUpdateItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemUpdateWithId)
  items: ItemUpdateWithId[];
}
