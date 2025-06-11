import 'dotenv/config';
import * as Joi from 'joi';
// TODO: validar mediante un esquema

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
}
const envsSchema = Joi.object({
  PORT: Joi.number().required().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
}).unknown(true);
const { error, value: env } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const envVars: EnvConfig = env;
export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
};
