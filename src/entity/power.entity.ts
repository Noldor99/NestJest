import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Hero } from './hero.entity';

@Entity()
export class Power {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  power: string;

  @ManyToOne(() => Hero, (hero) => hero.powers)
  hero: Hero;
}
