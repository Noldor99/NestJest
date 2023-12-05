/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataSource } from 'typeorm';
import CONNECTION from './database/db.connection';

//@ts-ignore
const AppDataSource = new DataSource({
  ...CONNECTION,
  entities: [__dirname + '*/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
