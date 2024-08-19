<script lang="ts">
	import { CURRENT_YEAR } from "$lib/utils/CONSTANTS";

	let { data, children } = $props();
</script>

<svelte:head>
	<title>{CURRENT_YEAR.toString() === data.year_string.substring(0, 4) ? "" : data.year_string} Members | AI@UNC</title>
</svelte:head>

{@render children()}
