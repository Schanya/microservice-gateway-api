import { Roles } from '@app/common';

export class CreateUserDto {
  login: string;
  email: string;
  password: string;
}
