import { ConfigModule, ConfigService, Environment } from '@libs/config';
import { Logger, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { MovieModule } from './modules/movie/movie.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      useFactory: (configService) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL'),
          transport:
            configService.get('NODE_ENV') === Environment.Development
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                }
              : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: async () => {
          const logger = new Logger('CacheModule');
          const store = await redisStore({
            socket: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            },
            password: configService.get('REDIS_PASSWORD'),
            ttl: configService.get('DEFAULT_GLOBAL_CACHE_TTL'),
          });

          store.getClient().on('error', (error) => {
            logger.error(error, 'CacheModule');
          });

          return store as unknown as CacheStore;
        },
      }),
      inject: [ConfigService],
    }),
    MovieModule,
  ],
})
export class AppModule {}
