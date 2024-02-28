import { ConfigService } from '@libs/config';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SearchMovieQuery } from './dtos/search-movie-query.dto';
import { SearchMovieResponse } from './dtos/search-movie-response.dto';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(this.constructor.name);

  private readonly apiKey: string = this.configService.get('TMDB_API_KEY');

  private readonly apiUrl: string = this.configService.get('TMDB_API_URL');

  private readonly apiVersion: string = this.configService.get('TMDB_API_VERSION');

  constructor(private readonly configService: ConfigService) {}

  async searchMovie(filter: SearchMovieQuery): Promise<SearchMovieResponse | null> {
    const url = this.buildUrl('search/movie', this.searchMovieQueryToSearchParams(filter));

    const response = await this.fetchData<SearchMovieResponse>(url);

    const returnData = plainToInstance(SearchMovieResponse, response, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    return returnData;
  }

  private fetchData<T>(url: URL, searchParams: URLSearchParams = new URLSearchParams()): Promise<T> {
    const request = this.buildRequest(this.appendSearchParams(url, searchParams));
    this.logger.debug(`Requesting ${request.url}`);
    return fetch(request)
      .then((response) => response.json())
      .catch((e) => {
        this.logger.error(e);
        throw new InternalServerErrorException('TMDB_API_ERROR');
      })
      .finally(() => this.logger.debug(`Requesting ${request.url} finished`));
  }

  private searchMovieQueryToSearchParams(query: SearchMovieQuery): URLSearchParams {
    const { includeAdult, primaryReleaseYear, ...rest } = query;

    return new URLSearchParams({
      include_adult: includeAdult,
      primary_release_year: primaryReleaseYear?.toString() ?? '',
      ...rest,
    } as unknown as Record<string, string>);
  }

  private appendSearchParams(url: URL, searchParams: URLSearchParams): URL {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    return url;
  }

  private buildRequest(url: URL, method: string = 'GET'): Request {
    url.searchParams.append('api_key', this.apiKey);

    const request = new Request(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return request;
  }

  private buildUrl(path: string, searchParams: URLSearchParams = new URLSearchParams()): URL {
    const url = new URL([this.apiVersion, path].join('/'), this.apiUrl);

    return this.appendSearchParams(url, searchParams);
  }
}
