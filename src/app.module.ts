import { ConfigModule, ConfigService, Environment } from '@libs/config';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

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
  ],
})
export class AppModule {}
