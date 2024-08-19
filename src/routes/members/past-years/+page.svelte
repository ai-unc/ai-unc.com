<script lang="ts">
	import { getYearSlugs } from "$lib/utils/years";

	const past_years = getYearSlugs().slice(0, 1);
</script>

<div class="container">
	<div class="heading">
		<h1>Past Years</h1>
		<hr />
	</div>

	<div class="years">
		{#each past_years as slug}
			<a href="/members/{slug}">{slug}</a>
		{/each}
	</div>
</div>

<style lang="postcss">
	.container {
		@apply mx-auto w-fit;
	}
	.heading {
		hr {
			@apply mb-8 mt-4 rounded-full border-tile-teal/50;
			border-width: 1.5px;
		}
		h1 {
			@apply mt-4 text-center text-6xl font-bold;
			opacity: 0.9;
		}
	}

	.years {
		@apply flex flex-col items-center gap-y-8;

		a {
			font-size: 40px;
			@apply font-medium;

			@apply hover:text-sunburst-yellow/90;
		}
	}
</style>
