import * as Joi from 'joi';
import { ElasticsearchMeetupDto } from '../dto';

export const ElasticsearchMeetupSchema = Joi.object<ElasticsearchMeetupDto>({
  searchText: Joi.string().max(255).required(),
});
