import { Test, TestingModule } from '@nestjs/testing';
import { HeroService } from './hero.service';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hero } from '../entity/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';
import { NotFoundException } from '@nestjs/common';
import { FindAllWithPaginationDto } from './dto/findAllWithPagination.dto';
import { FilesService } from '../files/files.service';

describe('HeroService', () => {
  let heroService: HeroService;
  let heroRepository: Repository<Hero>;
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroService,
        {
          provide: getRepositoryToken(Hero),
          useClass: Repository,
        },
        FilesService,
      ],
    }).compile();

    heroService = module.get<HeroService>(HeroService);
    heroRepository = module.get<Repository<Hero>>(getRepositoryToken(Hero));
    filesService = module.get<FilesService>(FilesService);
  });

  const createHeroDto: CreateHeroDto = {
    nickname: 'SuperHero',
    real_name: 'John Doe',
    origin_description: 'From a mysterious place',
    catch_phrase: 'I am a hero!',
    image: null,
  };

  const createdHero = new Hero();
  createdHero.id = 1;
  createdHero.powers = [];
  Object.assign(createdHero, createHeroDto);

  const heroes: Hero[] = [
    {
      id: 1,
      nickname: 'Superman',
      real_name: 'Clark Kent',
      origin_description: 'Krypton',
      catch_phrase: 'Truth, Justice, and the American Way',
      image: null,
      powers: [],
    },
    {
      id: 2,
      nickname: 'Supergirl',
      real_name: 'Kara Zor-El',
      origin_description: 'Krypton',
      catch_phrase: 'Hope, Help, and Compassion for All',
      image: null,
      powers: [],
    },
  ];

  it('should create a hero', async () => {
    jest.spyOn(heroRepository, 'create').mockReturnValueOnce(createdHero);
    jest.spyOn(heroRepository, 'save').mockResolvedValueOnce(createdHero);

    const result = await heroService.create(createHeroDto, null);

    expect(heroRepository.create).toHaveBeenCalledWith(createHeroDto);
    expect(heroRepository.save).toHaveBeenCalledWith(createdHero);
    expect(result).toEqual(createdHero);
  });

  it('should find all heroes with pagination', async () => {
    const findAllDto: FindAllWithPaginationDto = {
      page: 1,
      limit: 4,
    };

    const totalHeroes = heroes.length;

    jest
      .spyOn(heroRepository, 'findAndCount')
      .mockResolvedValueOnce([heroes, totalHeroes]);

    const result = await heroService.findAllHero(findAllDto);

    expect(heroRepository.findAndCount).toHaveBeenCalledWith({
      relations: {},
      take: findAllDto.limit,
      skip: (findAllDto.page - 1) * findAllDto.limit,
    });

    expect(result).toEqual([heroes, totalHeroes]);
  });

  it('should find a hero by ID', async () => {
    const heroId = 1;
    const existingHero = heroes.find((hero) => hero.id === heroId);
    jest.spyOn(heroRepository, 'findOne').mockResolvedValueOnce(existingHero);

    const result = await heroService.findOne(heroId);

    expect(heroRepository.findOne).toHaveBeenCalledWith({
      where: { id: heroId },
      relations: {},
    });
    expect(result).toEqual(existingHero);
  });

  it('should throw NotFoundException if hero with given ID is not found', async () => {
    const heroId = 2;
    jest.spyOn(heroRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(heroService.findOne(heroId)).rejects.toThrow(
      NotFoundException,
    );
    expect(heroRepository.findOne).toHaveBeenCalledWith({
      where: { id: heroId },
      relations: {},
    });
  });

  it('should remove a hero by ID', async () => {
    const heroId = 1;
    const existingHero = heroes.find((hero) => hero.id === heroId);

    jest.spyOn(heroRepository, 'findOne').mockResolvedValueOnce(existingHero);
    jest.spyOn(heroRepository, 'remove').mockResolvedValueOnce(existingHero);

    const result = await heroService.remove(heroId);

    expect(heroRepository.findOne).toHaveBeenCalledWith({
      where: { id: heroId },
      relations: {},
    });
    expect(heroRepository.remove).toHaveBeenCalledWith(existingHero);
    expect(result).toEqual(existingHero);
  });

  it('should throw NotFoundException if hero with given ID is not found', async () => {
    const heroId = 2;
    jest.spyOn(heroRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(heroService.remove(heroId)).rejects.toThrow(NotFoundException);
    expect(heroRepository.findOne).toHaveBeenCalledWith({
      where: { id: heroId },
      relations: {},
    });
  });

  it('should search heroes by name', async () => {
    const query = 'Super';

    const matchingHeroes: Hero[] = heroes.filter((hero) =>
      hero.nickname.includes(query),
    );

    jest.spyOn(heroRepository, 'find').mockResolvedValueOnce(matchingHeroes);

    const result = await heroService.searchHeroesByName(query);

    expect(heroRepository.find).toHaveBeenCalledWith({
      where: { nickname: ILike(`%${query}%`) },
      relations: {},
    });
    expect(result).toEqual(matchingHeroes);
  });
});
