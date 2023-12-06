import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { Hero } from '../entity/hero.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Hero])],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}
