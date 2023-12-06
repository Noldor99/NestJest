import {
  Body,
  Injectable,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user) {
      const passwordIsMatch = await bcrypt.compare(password, user.password);

      if (passwordIsMatch) {
        return user;
      }
    }

    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id, email }),
    };
  }
}
