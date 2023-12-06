import { Test, TestingModule } from '@nestjs/testing';
import { PowerService } from './power.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Power } from '../entity/power.entity';
import { Repository } from 'typeorm';
import { CreatePowerDto } from './dto/create-power.dto';
import { NotFoundException } from '@nestjs/common';

describe('PowerService', () => {
  let powerService: PowerService;
  let powerRepository: Repository<Power>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PowerService,
        {
          provide: getRepositoryToken(Power),
          useClass: Repository,
        },
      ],
    }).compile();

    powerService = module.get<PowerService>(PowerService);
    powerRepository = module.get<Repository<Power>>(getRepositoryToken(Power));
  });

  describe('addPower', () => {
    it('should add a power successfully', async () => {
      const createPowerDto: CreatePowerDto = {
        heroId: 1,
        power: 'Super Strength',
      };

      const createdPower = new Power();
      createdPower.id = 1;
      createdPower.power = 'Super Strength';

      jest.spyOn(powerRepository, 'create').mockReturnValueOnce(createdPower);
      jest.spyOn(powerRepository, 'save').mockResolvedValueOnce(createdPower);

      const result = await powerService.addPower(createPowerDto);

      expect(result).toEqual(createdPower);
    });
  });

  describe('removePower', () => {
    it('should remove a power successfully', async () => {
      const powerId = 1;
      const existingPower = new Power();
      existingPower.id = powerId;

      jest
        .spyOn(powerRepository, 'findOne')
        .mockResolvedValueOnce(existingPower);
      jest
        .spyOn(powerRepository, 'delete')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const result = await powerService.removePower(powerId);

      expect(result).toEqual({ message: `Power ${powerId} deleted` });
    });

    it('should throw NotFoundException if power with specified id is not found', async () => {
      const powerId = 1;

      jest.spyOn(powerRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(powerService.removePower(powerId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return a message if power id is not provided', async () => {
      const result = await powerService.removePower(null);

      expect(result).toEqual({ message: 'Power id is not provided' });
    });
  });
});
