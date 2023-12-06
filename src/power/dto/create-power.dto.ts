import { ApiProperty } from '@nestjs/swagger';

export class CreatePowerDto {
  @ApiProperty({
    example: 'Strong',
  })
  power: string;

  @ApiProperty()
  heroId: number;
}
