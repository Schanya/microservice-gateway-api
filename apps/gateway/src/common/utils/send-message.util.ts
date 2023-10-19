import { ClientProxy } from '@nestjs/microservices';

type SendMessageOptions = {
  client: ClientProxy;
  metadata: string;
  data: any;
};

export async function sendMessage<T>(
  sendMessageOptions: SendMessageOptions,
): Promise<T> {
  const { client, metadata, data } = sendMessageOptions;
  const response = await client.send(metadata, data).toPromise();

  return response;
}
