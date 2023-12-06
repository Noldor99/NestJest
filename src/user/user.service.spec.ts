import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(() => 'mocked-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      userRepositoryMock.findOne.mockReturnValue(null);
      userRepositoryMock.save.mockReturnValue({
        id: 1,
        ...createUserDto,
      });

      const result = await userService.createUser(createUserDto);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: expect.any(String),
      });
      expect(result).toEqual({
        id: 1,
        email: createUserDto.email,
        token: 'mocked-token',
      });
    });

    it('should throw BadRequestException if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      userRepositoryMock.findOne.mockReturnValue({ id: 1, ...createUserDto });

      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });
  });
});
