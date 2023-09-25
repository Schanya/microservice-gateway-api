import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMessage } from '../../common/utils/send-message.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH')
    private readonly client: ClientProxy,
  ) {}

  async test(name: string): Promise<string> {
    const greetings: string = await sendMessage({
      client: this.client,
      metadata: 'AUTH_TEST',
      data: { name },
    });

    return greetings;
  }
}
