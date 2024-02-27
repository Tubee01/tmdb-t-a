import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { SearchMovieQuery } from '../../tmdb/dtos/search-movie-query.dto';

export class QueryMovieDto implements Pick<SearchMovieQuery, 'query' | 'page'> {
  @IsString()
  @IsNotEmpty()
  query!: string;

  @IsNumber()
  @IsOptional()
  page?: number = 1;
}
