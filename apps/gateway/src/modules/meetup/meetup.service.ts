import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMessage } from '../../common/utils/send-message.util';

@Injectable()
export class MeetupService {
  constructor(
    @Inject('MEETUP')
    private readonly client: ClientProxy,
  ) {}

  public async getHello(): Promise<string> {
    return await sendMessage({
      client: this.client,
      metadata: 'getHello',
      data: 'Anna',
    });
  }
}
