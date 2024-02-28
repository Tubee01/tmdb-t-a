<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';

	export let data: PageServerData;

	let query: string = $page.url.searchParams.get('query') || '';
	let errorMessage: typeof data.error.message | null = null;
	let errorClearTimeout: ReturnType<typeof setTimeout>;
	let fetchTimeout: ReturnType<typeof setTimeout>;
	let searchSubmitButton: HTMLButtonElement;

	onMount(() => {
		handleErrorMessage(data?.error?.message);
	});

	function handleErrorMessage(message: typeof data.error.message) {
		if (!message) {
			return;
		}
		errorMessage = message;
		if (errorClearTimeout) {
			clearTimeout(errorClearTimeout);
		}
		errorClearTimeout = setTimeout(() => {
			errorMessage = null;
		}, 5000);
	}

	function submitSearch() {
		if (query?.trim().length >= 3 || query?.trim().length === 0) {
			if (fetchTimeout) {
				clearTimeout(fetchTimeout);
			}
			fetchTimeout = setTimeout(() => {
				searchSubmitButton.click();
			}, 300);
			errorMessage = null;
		}
	}

	$: movies = data?.movies?.results || null;
	$: currentPage = data.movies?.page || 1;
	$: totalPages = data.movies?.totalPages || 1;
	$: handleErrorMessage(data.error?.message);
</script>

<svelte:head>
	<title>Search Movies</title>
	<meta name="description" content="Search movies from The Movie Database (TMDB)" />
</svelte:head>

<div class="container mx-auto px-4 py-4 flex flex-col items-center gap-4">
	<form>
		<div class="flex items-center max-w-sm mx-auto">
			<label for="search" class="sr-only">Search</label>
			<div class="relative w-full">
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					id="search"
					name="query"
					class="input"
					placeholder="Search..."
					bind:value={query}
					on:input={submitSearch}
					required
					autofocus
				/>
			</div>
			<button
				bind:this={searchSubmitButton}
				type="submit"
				class="p-2.5 ms-2 text-sm font-medium btn variant-filled-primary"
			>
				<svg
					class="w-4 h-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 20 20"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
					/>
				</svg>
				<span class="sr-only">Search</span>
			</button>
		</div>
		<div class="flex max-w-sm mx-auto">
			{#if errorMessage === 'TMDB_API_ERROR'}
				<p class="text-red-500">Outer API call failed. Please try again later.</p>
			{:else if errorMessage === 'MISSING_SEARCH_QUERY'}
				<p class="text-red-500">Please enter a search value.</p>
			{:else if errorMessage}
				<p class="text-red-500">Something went wrong. Please try again later.</p>
			{/if}
		</div>
	</form>

	{#if movies?.length === 0}
		<p class="text-center">No movies found.</p>
	{:else if movies}
		<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each movies as movie}
				<div class="card card-hover overflow-hidden">
					<header>
						<img
							src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
							on:error={(e) =>
								Reflect.set(
									e.target,
									'src',
									'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
								)}
							alt={movie.title}
							loading="lazy"
						/>
					</header>
					<div class="p-4 space-y-4">
						<h6 class="h6">{movie.title}</h6>
						<hr class="opacity-50" />
						<article>
							<p>
								{movie.overview}
							</p>
						</article>
					</div>
				</div>
			{/each}
		</section>
		{#if movies.length > 0 && totalPages > 1}
			<p class="text-center">
				Page {currentPage} of {totalPages}
			</p>
			<nav class="flex justify-center gap-4 mt-4">
				<form>
					<input type="hidden" name="query" value={query} />
					<input type="hidden" name="page" value={currentPage - 1} />
					<button class="btn variant-filled-primary" type="submit" disabled={currentPage === 1}>
						Previous
					</button>
				</form>
				<form>
					<input type="hidden" name="query" value={query} />
					<input type="hidden" name="page" value={currentPage + 1} />
					<button
						class="btn variant-filled-primary"
						type="submit"
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</form>
			</nav>
		{/if}
	{/if}
</div>
