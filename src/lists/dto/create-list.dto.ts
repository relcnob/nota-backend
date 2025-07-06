import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ListItem } from 'src/items/entities/item.entity';
export class CreateListDto {
  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
    this.isPublic = false;
  }

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ListItem)
  listItems?: ListItem[];
}
