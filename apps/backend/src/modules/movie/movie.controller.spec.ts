import { Test } from '@nestjs/testing';
import { ConfigModule } from '@libs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TmdbModule } from '../tmdb/tmdb.module';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TmdbModule, ConfigModule],
      controllers: [MovieController],
      providers: [
        MovieService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => jest.fn(),
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieController = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = {
        page: 1,
        results: [
          {
            id: 33322,
            adult: false,
            backdropPath: null,
            genreIds: [16, 878, 53],
            originalLanguage: 'ja',
            originalTitle: 'アミテージ・ザ・サード POLY-MATRIX',
            overview:
              "Ross Sylibus is assigned to a police unit on a Martian colony, to find that women are being murdered by a psychotic named D'anclaude. He is assigned a very unorthodox partner named Naomi Armitage, who seems to have links to the victims. To stir things up more, every victim is found to be an illegally made third-generation android.",
            popularity: 11.49,
            posterPath: '/7sUCRdjGe7VggDCGIHywfguYdAK.jpg',
            releaseDate: '1996-06-25',
            title: 'Armitage III: Poly Matrix',
            video: false,
            voteAverage: 6.4,
            voteCount: 56,
          },
        ],
        totalPages: 1,
        totalResults: 1,
      };
      jest.spyOn(movieService, 'findAll').mockImplementation(async () => result);

      expect(
        await movieController.findAll({
          page: 1,
          query: 'Armitage III: Poly Matrix',
        }),
      ).toBe(result);
    });
  });
});
