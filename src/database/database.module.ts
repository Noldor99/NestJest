/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import CONNECTION from './db.connection';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      //@ts-ignore
      useFactory: (configService: ConfigService) => ({
        ...CONNECTION,
        entities: [__dirname + '/../**/*.entity{.js, .ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
