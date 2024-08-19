<script lang="ts">
	import type { HTMLAttributeAnchorTarget } from "svelte/elements";
	import type { Component } from "svelte";
	import { onMount } from "svelte";

	import GitHub from "./GitHub.svelte";
	import Discord from "./Discord.svelte";
	import Instagram from "./Instagram.svelte";

	// Svelte 5
	// type Props = { link: string; icon?: ComponentType | undefined; target?: HTMLAttributeAnchorTarget; class?: string };
	// let { link, icon, target = "_blank", class: classProp = "" }: Props = $props();

	export let link: string;
	export let icon: Component | undefined = undefined;
	export let target: HTMLAttributeAnchorTarget = "_blank";
	let classProp: string = "";
	export { classProp as class };

	onMount(() => {
		if (link.match(/^https:\/\/(www\.)?github/)) icon = GitHub;
		else if (link.match(/^https:\/\/(www\.)?discord/)) icon = Discord;
		else if (link.match(/^https:\/\/(www\.)?instagram/)) icon = Instagram;
	});
</script>

<a class="socials-link {classProp}" href={link} {target}>
	<svelte:component this={icon} />
</a>

<style lang="postcss">
	.socials-link {
		@apply fill-gray-700 duration-500 hover:fill-gray-500;

		:global(svg) {
			width: inherit;
			height: inherit;
		}
	}
</style>
