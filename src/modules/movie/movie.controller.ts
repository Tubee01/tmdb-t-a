import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@libs/cache';
import { MovieService } from './movie.service';
import { QueryMovieDto } from './dtos/query-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll(@Query() query: QueryMovieDto) {
    return this.movieService.findAll(query);
  }
}
