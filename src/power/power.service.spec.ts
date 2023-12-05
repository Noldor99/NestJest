import { Test, TestingModule } from '@nestjs/testing';
import { PowerService } from './power.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePowerDto } from './dto/create-power.dto';
import { NotFoundException } from '@nestjs/common';
import { Power } from '../entity/power.entity';

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
    it('should add a new power', async () => {
      const createPowerDto: CreatePowerDto = {
        power: 'Flight',
      };

      const createdPower = new Power();
      createdPower.id = 1;
      createdPower.power = 'Flight';

      jest.spyOn(powerRepository, 'create').mockReturnValueOnce(createdPower);
      jest.spyOn(powerRepository, 'save').mockResolvedValueOnce(createdPower);

      const result = await powerService.addPower(createPowerDto);

      expect(powerRepository.create).toHaveBeenCalledWith(createPowerDto);
      expect(powerRepository.save).toHaveBeenCalledWith(createdPower);
      expect(result).toEqual(createdPower);
    });
  });

  describe('removePower', () => {
    it('should remove a power by id', async () => {
      const powerId = 1;

      const existingPower = new Power();
      existingPower.id = powerId;
      existingPower.power = 'Super Strength';

      jest
        .spyOn(powerRepository, 'findOne')
        .mockResolvedValueOnce(existingPower);
      jest
        .spyOn(powerRepository, 'delete')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const result = await powerService.removePower(powerId);

      expect(powerRepository.findOne).toHaveBeenCalledWith({
        where: { id: powerId },
      });
      expect(powerRepository.delete).toHaveBeenCalledWith(powerId);
      expect(result).toEqual({ message: `Power ${powerId} deleted` });
    });

    it('should throw NotFoundException if power with given id is not found', async () => {
      const powerId = 2;

      jest.spyOn(powerRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(powerService.removePower(powerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(powerRepository.findOne).toHaveBeenCalledWith({
        where: { id: powerId },
      });
    });

    it('should return a message if powerId is null or undefined', async () => {
      const resultNull = await powerService.removePower(null);
      const resultUndefined = await powerService.removePower(undefined);

      expect(resultNull).toEqual({ message: 'Power id is not provided' });
      expect(resultUndefined).toEqual({ message: 'Power id is not provided' });
    });
  });
});
