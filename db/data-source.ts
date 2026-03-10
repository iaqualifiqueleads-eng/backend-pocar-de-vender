import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from 'src/config/env.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: env.database.host,
  port: env.database.port,
  database: env.database.database,
  username: env.database.userName,
  password: env.database.password,
  synchronize: env.database.synchronize,
  timezone: "-03:00",

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
