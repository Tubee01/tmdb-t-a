import { CACHE_TTL_METADATA, CacheInterceptor as NestJsCacheInterceptor } from '@nestjs/cache-manager';
import { Injectable, ExecutionContext, CallHandler, Logger, StreamableFile } from '@nestjs/common';
import { type Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor extends NestJsCacheInterceptor {
  protected readonly keyPrefix = 'cache';

  private readonly cacheRouteHit: Map<string, number> = new Map();

  private readonly logger = new Logger(this.constructor.name);

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { url } = context.switchToHttp().getRequest();
    const key = this.getKey(context);
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
      this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
      null;

    if (!key) {
      this.cacheRouteHit.set(url, 0);
      return next.handle();
    }

    try {
      const value = await this.cacheManager.get(key);
      if (value) {
        this.cacheRouteHit.set(url, (this.cacheRouteHit.get(url) || 0) + 1);
        return of(value);
      }
      this.cacheRouteHit.set(url, 0);

      const ttl = typeof ttlValueOrFactory === 'function' ? await ttlValueOrFactory(context) : ttlValueOrFactory;

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) {
            return;
          }

          const args = [key, response];
          if (ttl) {
            args.push({ ttl });
          }

          try {
            await this.cacheManager.set(...args);
          } catch (err) {
            this.logger.error(`An error has occurred when inserting "key: ${key}", "value: ${response}"`);
          }
        }),
      );
    } catch {
      return next.handle();
    } finally {
      this.logger.log(`Route ${url} current cache hit: ${this.cacheRouteHit.get(url)}`);
    }
  }

  private getKey(context: ExecutionContext): string {
    const key = this.trackBy(context);

    if (!key) {
      return '';
    }

    return [this.keyPrefix, key].join(':');
  }
}
