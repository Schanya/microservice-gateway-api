import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MeetupService {
  constructor(
    @Inject('MEETUP_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  public getHello(): Promise<string> {
    return this.client.send<string, string>('getHello', 'Anna').toPromise();
  }
}
