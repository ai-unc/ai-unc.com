<script>
	import { page } from "$app/stores";
</script>

<h1>Error: {$page.status}</h1>
<div>{$page.error?.message}</div>
<div><a href="/">Back to Home</a></div>

<style lang="postcss">
	h1 {
		@apply mt-4 text-center text-2xl font-bold md:text-4xl lg:text-5xl xl:text-6xl;
		opacity: 0.9;
	}
	div {
		@apply mx-auto;
		width: fit-content;

		@apply mt-8;
	}
	a {
		@apply rounded bg-base p-2;

		@apply font-medium;

		@apply text-xs md:text-sm lg:text-lg xl:text-xl;

		&:hover {
			@apply bg-base/80;
		}
	}
</style>
