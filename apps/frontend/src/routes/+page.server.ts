import type { PageServerLoad } from './$types';
import type { SearchMovieResult } from './interface';

export type ErrorMessage = 'TMDB_API_ERROR' | 'SOMETHING_WENT_WRONG' | 'MISSING_SEARCH_QUERY';

export const load: PageServerLoad = async ({ fetch, url }) => {
	if (typeof url.searchParams.get('query') !== 'string') {
		return;
	}

	if (url.searchParams.get('query') === '') {
		return {
			error: {
				message: 'MISSING_SEARCH_QUERY' as ErrorMessage
			}
		};
	}

	try {
		const res = await fetch(`/api/movie${url.search}`);
		const resJson = await res.json();
		if (!res.ok) {
			return {
				error: resJson as { message: ErrorMessage }
			};
		}
		return {
			movies: resJson as SearchMovieResult
		};
	} catch (e) {
		return {
			error: {
				message: 'SOMETHING_WENT_WRONG' as ErrorMessage
			}
		};
	}
};
