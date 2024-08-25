<script lang="ts">
	let { data, children } = $props();
	let { CURRENT_YEAR } = data;
</script>

<svelte:head>
	<title>{CURRENT_YEAR.toString() === data.year_string.substring(0, 4) ? "" : data.year_string} Members | AI@UNC</title>
</svelte:head>

{@render children()}
