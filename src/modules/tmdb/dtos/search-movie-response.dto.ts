import { Expose, Type } from 'class-transformer';
import { MovieDto } from './movie.dto';

export class SearchMovieResponse {
  @Expose()
  page!: number;

  @Expose()
  @Type(() => MovieDto)
  results!: any[];

  @Expose({ name: 'total_pages' })
  totalPages!: number;

  @Expose({ name: 'total_results' })
  totalResults!: number;
}
