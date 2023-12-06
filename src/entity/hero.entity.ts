import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Power } from './power.entity';

@Entity()
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  real_name: string;

  @Column('text')
  origin_description: string;

  @Column()
  catch_phrase: string;

  @OneToMany(() => Power, (power) => power.hero, { onDelete: 'CASCADE' })
  powers: Power[];

  @Column({ nullable: true })
  image: string;
}
