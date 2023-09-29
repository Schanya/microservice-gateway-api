import * as Joi from 'joi';
import { ReadAllMeetupDto } from '../dto';
import { BaseReadAllSchema } from '@app/common';

export const ReadAllMeetupSchema = Joi.object<ReadAllMeetupDto>({
  title: Joi.string().max(255).optional(),
  description: Joi.string().max(255).optional(),
  tags: Joi.array<String>().optional(),
  place: Joi.string().max(255).optional(),
})
  .options({
    abortEarly: false,
  })
  .concat(BaseReadAllSchema);
