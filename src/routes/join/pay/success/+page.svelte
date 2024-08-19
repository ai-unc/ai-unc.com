<svelte:head>
	<title>AI@UNC</title>
</svelte:head>

<div class="heading">
	<h1>Success!</h1>
	<h2>Your dues have been paid.</h2>
	<a href="/">Back to Home</a>
</div>

<style lang="postcss">
	.heading {
		@apply flex flex-col items-center;

		@apply gap-y-8;
	}
	h1 {
		@apply text-2xl font-bold md:text-4xl lg:text-5xl xl:text-6xl;

		@apply text-dasyphyllous-green;

		@apply -mb-2 mt-4;
	}
	a {
		@apply rounded bg-base p-2;
		width: fit-content;

		@apply font-medium;

		@apply text-xs md:text-sm lg:text-lg xl:text-xl;

		&:hover {
			@apply bg-base/80;
		}
	}
</style>
