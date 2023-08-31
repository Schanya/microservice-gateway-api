import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  RABBIT_MQ_URI: Joi.string().required(),
  QUEUE_MEETUP_SERVICE: Joi.string().required(),
});