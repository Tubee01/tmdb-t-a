export class SearchMovieQuery {
  query!: string;

  includeAdult?: boolean;

  language?: string;

  primaryReleaseYear?: number;

  page?: number;

  region?: string;

  year?: number;
}
