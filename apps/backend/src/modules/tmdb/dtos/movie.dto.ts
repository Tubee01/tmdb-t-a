import { Expose } from 'class-transformer';

export class MovieDto {
  @Expose()
  id: number;

  @Expose()
  adult: boolean;

  @Expose({ name: 'backdrop_path' })
  backdropPath: string;

  @Expose({ name: 'genre_ids' })
  genreIds: number[];

  @Expose({ name: 'original_language' })
  originalLanguage: string;

  @Expose({ name: 'original_title' })
  originalTitle: string;

  @Expose()
  overview: string;

  @Expose()
  popularity: number;

  @Expose({ name: 'poster_path' })
  posterPath: string;

  @Expose({ name: 'release_date' })
  releaseDate: string;

  @Expose()
  title: string;

  @Expose()
  video: boolean;

  @Expose({ name: 'vote_average' })
  voteAverage: number;

  @Expose({ name: 'vote_count' })
  voteCount: number;
}
