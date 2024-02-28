import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { AppModule } from '../src/app.module';

describe('MovieController (e2e)', () => {
  let app: INestApplication;
  let cache: Cache;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => jest.fn(),
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    cache = moduleFixture.get<Cache>(CACHE_MANAGER);
    await app.init();
  });

  it('/movie (GET)', () => {
    return request(app.getHttpServer())
      .get('/movie')
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: ['query should not be empty', 'query must be a string'],
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
  });

  it('/movie?query=matrix (GET)', () => {
    return request(app.getHttpServer())
      .get('/movie?query=matrix')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('results');
        expect(res.body.page).toBe(1);
      });
  });

  it('/movie?query=matrix&page=2 (GET)', () => {
    return request(app.getHttpServer())
      .get('/movie?query=matrix&page=2')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('results');
        expect(res.body.page).toBe(2);
      });
  });

  describe('Cache', () => {
    it(`should get the value from cache`, async () => {
      const spy = jest.spyOn(cache, 'get');

      await request(app.getHttpServer())
        .get('/movie?query=matrix')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('results');
        });
      await request(app.getHttpServer())
        .get('/movie?query=matrix')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('results');
        });
      expect(spy).toHaveBeenCalledTimes(2);
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
