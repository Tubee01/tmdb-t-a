import Joi from 'joi';
import { ConfigVariables, Environment } from './config.interface';

export const ConfigVariablesSchema = Joi.object<ConfigVariables>({
  npm_package_version: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Development),
  TZ: Joi.string().default('UTC'),
  APP_PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().default('debug'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().default(null),
  DEFAULT_GLOBAL_CACHE_TTL: Joi.number().default(120), // 2 minutes in seconds
  TMDB_API_KEY: Joi.string().required(),
  TMDB_API_URL: Joi.string().default('https://api.themoviedb.org/'),
  TMDB_API_VERSION: Joi.string().default('3'),
}).options({
  stripUnknown: true,
  abortEarly: true,
});
