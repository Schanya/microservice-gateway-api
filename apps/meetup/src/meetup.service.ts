import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetupService {
  getHello(name: string): string {
    return `Hello ${name}!`;
  }
}
