import { ApiProperty } from '@nestjs/swagger';

export class CreateHeroDto {
  @ApiProperty({
    example: 'Superman',
    description: "The superhero's nickname",
  })
  readonly nickname: string;

  @ApiProperty({
    example: 'Clark Kent',
    description: "The superhero's real name",
  })
  readonly real_name: string;

  @ApiProperty({
    example: 'He was born Kal-El on the planet Krypton...',
    description: 'The origin description of the superhero',
  })
  readonly origin_description: string;

  @ApiProperty({
    example: "Look, up in the sky, it's a bird, it's a plane, it's Superman!",
    description: 'The catch phrase of the superhero',
  })
  readonly catch_phrase: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of the device',
    required: false,
  })
  image?: any;
}
