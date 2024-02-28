import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@libs/config';
import { TmdbService } from './tmdb.service';

describe('Tmdb Test suite', () => {
  describe('searchMovie', () => {
    let tmdbService: TmdbService;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [ConfigModule],
        providers: [TmdbService],
      }).compile();

      tmdbService = module.get<TmdbService>(TmdbService);
    });

    it('should be defined', () => {
      expect(tmdbService).toBeDefined();
    });

    it('should return results', async () => {
      const result = await tmdbService.searchMovie({ query: 'matrix' });
      expect(result).toHaveProperty('results');
    });
  });

  describe('When the API key is invalid', () => {
    let tmdbService: TmdbService;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [ConfigModule],
        providers: [TmdbService],
      })
        .overrideProvider(ConfigService)
        .useValue({
          get: (key: string) => {
            if (key === 'TMDB_API_KEY') {
              return 'invalid_key';
            }

            if (key === 'TMDB_API_URL') {
              return 'https://api.themoviedb.org/';
            }

            if (key === 'TMDB_API_VERSION') {
              return '3';
            }

            return null;
          },
        })
        .compile();
      tmdbService = module.get<TmdbService>(TmdbService);
    });

    it('should throw an error', async () => {
      await expect(tmdbService.searchMovie({ query: 'matrix' })).rejects.toThrow('TMDB_API_ERROR');
    });
  });

  describe('When the API URL is invalid', () => {
    let tmdbService: TmdbService;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [ConfigModule],
        providers: [TmdbService],
      })
        .overrideProvider(ConfigService)
        .useValue({
          get: (key: string) => {
            if (key === 'TMDB_API_KEY') {
              return process.env.TMDB_API_KEY;
            }

            if (key === 'TMDB_API_URL') {
              return 'invalid_url';
            }

            if (key === 'TMDB_API_VERSION') {
              return '3';
            }

            return null;
          },
        })
        .compile();
      tmdbService = module.get<TmdbService>(TmdbService);
    });

    it('should throw an error', async () => {
      await expect(tmdbService.searchMovie({ query: 'matrix' })).rejects.toThrow('INVALID_URL');
    });
  });

  describe('When the API URL is valid but not reachable', () => {
    let tmdbService: TmdbService;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [ConfigModule],
        providers: [TmdbService],
      })
        .overrideProvider(ConfigService)
        .useValue({
          get: (key: string) => {
            if (key === 'TMDB_API_KEY') {
              return process.env.TMDB_API_KEY;
            }

            if (key === 'TMDB_API_URL') {
              return 'https://api.themoviedb.here/';
            }

            if (key === 'TMDB_API_VERSION') {
              return '3';
            }

            return null;
          },
        })
        .compile();
      tmdbService = module.get<TmdbService>(TmdbService);
    });

    it('should throw an error', async () => {
      await expect(tmdbService.searchMovie({ query: 'matrix' })).rejects.toThrow('TMDB_API_ERROR');
    });
  });

  describe('When the API URL is valid but wrong version', () => {
    let tmdbService: TmdbService;
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [ConfigModule],
        providers: [TmdbService],
      })
        .overrideProvider(ConfigService)
        .useValue({
          get: (key: string) => {
            if (key === 'TMDB_API_KEY') {
              return process.env.TMDB_API_KEY;
            }

            if (key === 'TMDB_API_URL') {
              return 'https://api.themoviedb.org/';
            }

            if (key === 'TMDB_API_VERSION') {
              return 'invalid_version';
            }

            return null;
          },
        })
        .compile();

      tmdbService = module.get<TmdbService>(TmdbService);
    });

    it('should throw an error', async () => {
      await expect(tmdbService.searchMovie({ query: 'matrix' })).rejects.toThrow('TMDB_API_ERROR');
    });
  });
});
