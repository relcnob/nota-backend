import { User } from 'src/users/entities/user.entity';

export type SafeUser = Omit<
  User,
  'password' | 'hashPassword' | 'comparePassword'
>;
