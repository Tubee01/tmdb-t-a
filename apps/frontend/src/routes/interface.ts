export interface Movie {
	id: number;
	adult: boolean;
	backdropPath: string;
	genreIds: number[];
	originalLanguage: string;
	originalTitle: string;
	overview: string;
	popularity: number;
	posterPath: string;
	releaseDate: string;
	title: string;
	video: boolean;
	voteAverage: number;
	voteCount: number;
}

export interface SearchMovieResult {
	page: number;
	results: Movie[];
	totalResults: number;
	totalPages: number;
}
