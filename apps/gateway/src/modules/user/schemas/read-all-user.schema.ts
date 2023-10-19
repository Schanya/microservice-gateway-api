import * as Joi from 'joi';

import { BaseReadAllSchema } from '@app/common';
import { ReadAllUserDto } from '../dto/read-all-user.dto';

export const ReadAllUserSchema = Joi.object<ReadAllUserDto>({
  login: Joi.string().optional(),
  email: Joi.string().email().optional(),
})
  .options({
    abortEarly: false,
  })
  .concat(BaseReadAllSchema);
