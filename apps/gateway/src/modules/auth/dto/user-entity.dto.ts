export class User {
  id: number;
  login: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  provider?: 'LOCAL' | 'GOOGLE';
}
