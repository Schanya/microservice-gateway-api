import * as Joi from 'joi';

import { PaginationSchema } from './pagination.schema';
import { SortingSchema } from './sorting.schema';

export const BaseReadAllSchema = Joi.object({
  pagination: PaginationSchema.optional(),
  sorting: SortingSchema.optional(),
}).options({
  abortEarly: false,
});
