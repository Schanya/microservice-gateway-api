import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  RABBIT_MQ_URI: Joi.string().required(),
  RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
  RABBIT_MQ_MEETUP_QUEUE: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URL: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ROUTE_NAME: Joi.string().required(),
});
