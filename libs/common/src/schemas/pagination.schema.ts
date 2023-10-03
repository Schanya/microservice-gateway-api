import * as Joi from 'joi';
import { PaginationDto } from '../dto/pagination.dto';

import { defaultPagination } from '../constants/pagination.constant';

export const PaginationSchema = Joi.object<PaginationDto>({
  page: Joi.number().integer().min(1).default(defaultPagination.page),
  size: Joi.number().integer().min(1).max(50).default(defaultPagination.size),
}).options({
  abortEarly: false,
});
