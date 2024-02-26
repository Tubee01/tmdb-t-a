import { Injectable } from '@nestjs/common';
import { TmdbService } from '../tmdb/tmdb.service';
import { SearchMovieQuery } from '../tmdb/dtos/search-movie-query.dto';

@Injectable()
export class MovieService {
  constructor(private readonly tmdbService: TmdbService) {}

  async findAll(query: SearchMovieQuery) {
    return this.tmdbService.searchMovie(query);
  }
}
