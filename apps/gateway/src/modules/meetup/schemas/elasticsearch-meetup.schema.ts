import * as Joi from 'joi';
import { EsMeetupDto } from '../dto';

export const EsMeetupSchema = Joi.object<EsMeetupDto>({
  searchText: Joi.string().max(255).required(),
});
