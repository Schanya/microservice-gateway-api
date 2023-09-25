import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async test(name: string): Promise<string> {
    const greetings = `Hello from auth microservise for ${name}`;

    return greetings;
  }
}
