import { ConfigModuleOptions } from '@nestjs/config';
import { envValidationSchema } from '../schemas/env-validation.schema';

export const envSchemaOptions: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: envValidationSchema,
  envFilePath: './apps/auth/.env',
};
