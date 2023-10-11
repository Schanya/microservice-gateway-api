import { User } from '../dto';

export class FrontendUser {
  id: number;
  login: string;
  email: string;

  constructor(user: User) {
    this.id = user?.id;
    this.login = user?.login;
    this.email = user?.email;
  }
}
