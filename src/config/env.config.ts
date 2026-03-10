import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

const env = {
  environment: configService.getOrThrow('NODE_ENV'),
  port: parseInt(configService.getOrThrow('PORT')),
  jwtSecret: configService.getOrThrow('JWT_SECRET'),
  jwtExpireIn: configService.getOrThrow('JWT_EXPIRE_IN'),

  databaseSystemIds: configService.getOrThrow<string>('DATABASE_SYSTEM_IDS'),

  database: {
    host: configService.getOrThrow<string>('MYSQL_HOST'),
    port: parseInt(configService.getOrThrow<string>('MYSQL_PORT')),
    database: configService.getOrThrow<string>('MYSQL_DATABASE'),
    userName: configService.getOrThrow<string>('MYSQL_USER'),
    password: configService.getOrThrow<string>('MYSQL_PASSWORD'),
    synchronize: configService.getOrThrow<boolean>('MYSQL_SYNCHRONIZE'),
  },
};

export { env };
