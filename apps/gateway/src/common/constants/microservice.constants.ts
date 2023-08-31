import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const MEETUP_CLIENT_NAME = 'MEETUP_SERVICE';

export const MEETUP_CLIENT_OPTIONS: ClientProviderOptions = {
  name: MEETUP_CLIENT_NAME,
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://rabbitmq:5672'],
    queue: 'meetup_queue',
    queueOptions: {
      durable: false,
    },
  },
};
