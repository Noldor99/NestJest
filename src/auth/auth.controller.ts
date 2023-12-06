import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('1.auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          default: 'user@example.com',
        },
        password: {
          type: 'string',
          default: 'password123',
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: 'Successful login' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
