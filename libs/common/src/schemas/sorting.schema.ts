import * as Joi from 'joi';
import { SortingDto } from '../dto/sorting.dto';

import { defaultPagination } from '../constants/pagination.constant';
import { defaultSorting } from '../constants/sorting.constant';

export const SortingSchema = Joi.object<SortingDto>({
  column: Joi.string().default(defaultSorting.column),
  direction: Joi.string().valid('DESC', 'ASC').default(defaultPagination.size),
}).options({
  abortEarly: false,
});
