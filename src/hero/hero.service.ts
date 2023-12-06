import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from '../entity/hero.entity';
import { ILike, Repository } from 'typeorm';
import { CreateHeroDto } from './dto/create-hero.dto';
import { FindAllWithPaginationDto } from './dto/findAllWithPagination.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private heroRepository: Repository<Hero>,
    private fileService: FilesService,
  ) {}

  async create(createHeroDto: CreateHeroDto, image: any): Promise<Hero> {
    const { nickname, real_name, catch_phrase, origin_description } =
      createHeroDto;

    let fileName = null;

    if (image) {
      fileName = await this.fileService.createFile(image);
    }

    const hero = this.heroRepository.create({
      nickname,
      real_name,
      catch_phrase,
      origin_description,
      image: fileName,
    });

    return await this.heroRepository.save(hero);
  }

  async findAllHero(dto: FindAllWithPaginationDto) {
    const { page = 1, limit = 4 } = dto;

    const [heroes, total] = await this.heroRepository.findAndCount({
      relations: {},
      take: limit,
      skip: (page - 1) * limit,
    });

    return [heroes, total];
  }

  async findOne(id: number): Promise<Hero> {
    const hero = await this.heroRepository.findOne({
      where: { id },
      relations: {},
    });

    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }

    return hero;
  }
  async editHero(heroId: number, updateHeroDto: UpdateHeroDto) {
    const { nickname, real_name, catch_phrase, origin_description } =
      updateHeroDto;
    const hero = await this.heroRepository.findOne({
      where: { id: heroId },
      relations: {},
    });

    if (!hero) {
      throw new NotFoundException(`Hero with ID ${heroId} not found`);
    }

    if (nickname) hero.nickname = nickname;
    if (real_name) hero.real_name = real_name;
    if (catch_phrase) hero.catch_phrase = catch_phrase;
    if (origin_description) hero.origin_description = origin_description;

    const updateHero = await this.heroRepository.save(hero);
    return updateHero;
  }

  async searchHeroesByName(query: string): Promise<Hero[]> {
    console.log(query);
    const heroes = await this.heroRepository.find({
      where: {
        nickname: ILike(`%${query}%`),
      },
      relations: {},
    });
    return heroes;
  }

  async remove(id: number) {
    const hero = await this.heroRepository.findOne({
      where: { id },
      relations: {},
    });

    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }

    return await this.heroRepository.remove(hero);
  }
}
