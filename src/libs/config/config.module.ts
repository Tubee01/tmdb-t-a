import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestjsConfigModule } from '@nestjs/config';
import { ConfigVariablesSchema } from './config.validation';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestjsConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validationSchema: ConfigVariablesSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
