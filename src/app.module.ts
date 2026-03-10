import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { env } from './config/env.config';
import { DataBaseModule } from './domain/database.module';
import { AuthModule } from './application/auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => env],
    }),
    // BullModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     redis: {
    //       host: config.get('REDIS_URL'),
    //       // port: config.get('REDIS_PORT'),
    //       defaultJobOptions: {
    //         removeOnComplete: true,
    //         removeOnFail: 100,
    //         attempts: 3,
    //         backoff: {
    //           type: 'exponential',
    //           delay: 5000,
    //         },
    //       },
    //     },
    //     limiter: {
    //       max: 10,
    //       duration: 1000,
    //     },
    //   }),
    // }),
    // ScheduleModule.forRoot(),
    AuthModule,
    DataBaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
