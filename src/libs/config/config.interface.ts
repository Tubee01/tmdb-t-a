export enum Environment {
  Development = 'development',
  Stage = 'stage',
  Production = 'production',
}

export interface RedisConfigVariables {
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

export interface ConfigVariables extends RedisConfigVariables, Pick<NodeJS.ProcessEnv, 'npm_package_version' | 'TZ'> {
  NODE_ENV: Environment;
  APP_PORT: number;
  LOG_LEVEL: string;
  TMDB_API_KEY: string;
}
