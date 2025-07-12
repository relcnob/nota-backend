import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('owner' | 'editor' | 'viewer')[]) =>
  SetMetadata('roles', roles);
