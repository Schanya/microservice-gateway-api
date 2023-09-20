import { MeetupFrontend } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMessage } from '../../common/utils/send-message.util';

@Injectable()
export class MeetupService {
  constructor(
    @Inject('MEETUP')
    private readonly client: ClientProxy,
  ) {}

  async readById(id: string): Promise<MeetupFrontend> {
    const meetup: MeetupFrontend = await sendMessage({
      client: this.client,
      metadata: 'MEETUP_GET_BY_ID',
      data: { id },
    });

    return meetup;
  }
}
