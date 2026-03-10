import { registerAs } from '@nestjs/config';
import { env } from './env.config';

export const getDatabaseSystemIds = (): string[] => {
  return env.databaseSystemIds.split(';');
};

export default registerAs('orm', () => {
  const config = {};

  getDatabaseSystemIds().forEach((systemId) => {
    config[systemId] = {
      type: 'mysql',
      host: env.database.host,
      port: env.database.port,
      username: env.database.userName,
      password: env.database.password,
      database: systemId,
      synchronize: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: ['dist/db/migrations/*.js'],
    };
  });

  return config;
});
