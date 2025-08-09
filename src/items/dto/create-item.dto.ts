import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  quantity?: number = 1;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @IsUUID()
  @IsNotEmpty()
  listId: string;

  @IsOptional()
  @IsUUID()
  addedById?: string;
}
