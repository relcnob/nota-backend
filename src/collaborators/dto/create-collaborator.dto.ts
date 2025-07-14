import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCollaboratorDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['viewer', 'editor'])
  role: 'viewer' | 'editor';
}
