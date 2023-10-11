import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  RABBIT_MQ_URI: Joi.string().required(),
  RABBIT_MQ_MEETUP_QUEUE: Joi.string().required(),

  ELASTICSEARCH_NODE: Joi.string().required(),
  ELASTICSEARCH_PASSWORD: Joi.string().required(),
  ELASTICSEARCH_USERNAME: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
});
