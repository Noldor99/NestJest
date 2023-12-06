import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindAllWithPaginationDto } from './dto/findAllWithPagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('hero')
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createHeroDto: CreateHeroDto, @UploadedFile() image) {
    return this.heroService.create(createHeroDto, image);
  }

  @Get('pagination')
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 4 })
  async findAllWithPagination(@Query() params: FindAllWithPaginationDto) {
    const [heroes, total] = await this.heroService.findAllHero(params);
    return { heroes, total };
  }

  @Get('search')
  @ApiQuery({ name: 'query', type: String, required: false, example: 'super' })
  async searchHeroes(@Query('query') query: string) {
    const heroes = await this.heroService.searchHeroesByName(query);
    return heroes;
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID of the hero' })
  getOne(@Param('id') id: number) {
    return this.heroService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') heroId: number,
    @Body() updateHeroDto: UpdateHeroDto,
  ) {
    return await this.heroService.editHero(heroId, updateHeroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroService.remove(+id);
  }
}
