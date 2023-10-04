import * as Joi from 'joi';
import { GoogleUserDto } from '../dto';

export const GoogleUserSchema = Joi.object<GoogleUserDto>({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  picture: Joi.string().optional(),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().optional(),
}).options({ abortEarly: false });
