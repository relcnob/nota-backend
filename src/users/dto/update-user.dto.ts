import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  constructor(username?: string, email?: string, password?: string) {
    super();
    if (username) this.username = username;
    if (email) this.email = email;
    if (password) this.password = password;
  }

  username?: string;
  email?: string;
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
