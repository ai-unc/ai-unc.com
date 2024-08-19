<script lang="ts">
	import { page } from "$app/stores";
	import type { Snippet } from "svelte";

	type Props = {
		href: string;
		children: Snippet;
		match_root?: boolean;
		title?: string;
		target?: string;
		[key: string]: any;
	};
	let { href, children, match_root = false, title, target, ...props }: Props = $props();
</script>

<li {...props}>
	{#if title}
		<a {href} {target} class:active={match_root ? href.split("/")[1] === $page.route.id?.split("/")[1] : href === $page.route.id}>
			{title}
		</a>
		{@render children()}
	{:else}
		<a {href} {target} class:active={match_root ? href.split("/")[1] === $page.route.id?.split("/")[1] : href === $page.route.id}>
			{@render children()}
		</a>
	{/if}
</li>

<style lang="postcss">
	li a {
		@apply font-normal;
		@apply text-haze-offwhite/90;

		@apply p-2 lg:px-2 lg:py-4;
		@apply text-xl lg:text-[18px];

		@apply mx-auto block w-fit;

		@apply transition-colors;
		transition-duration: 300ms;

		@apply hover:text-sunburst-yellow;
	}

	a.active {
		@apply text-sunburst-yellow;
	}

	li {
		&.join {
			a {
				@apply rounded-sm bg-base px-4 py-2 font-semibold;
			}
			@media all and (min-width: 1024px) {
				&:hover {
					transform: scale(1.1);
					transition: transform 100ms ease-in-out;
				}
			}
		}

		@apply relative;

		@media all and (min-width: 1024px) {
			&:hover :global(.child-list) {
				@apply flex;

				@apply bg-black/50;

				@apply rounded-xl ring-1 ring-haze-offwhite/80;

				opacity: 0;

				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				animation: fade-in 300ms ease-in 200ms 1 forwards;
			}
		}
	}
</style>
