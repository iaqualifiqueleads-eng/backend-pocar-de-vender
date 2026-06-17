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
      synchronize: env.database.synchronize,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: ['dist/db/migrations/*.js'],
      extra: {
        connectionLimit: 5,
        connectTimeout: 30000,
        acquireTimeout: 30000,
        waitForConnections: true,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      },
    };
  });

  return config;
});
