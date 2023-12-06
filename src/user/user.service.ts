import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email already exists!');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ email: createUserDto.email });

    return { id: user.id, email: user.email, token };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return this.userRepository.find({
      where: { id },
    });
  }

  async getAllUsers() {
    return this.userRepository.find({ relations: null });
  }
}
