<script lang="ts">
	import TimelineEventComponent from "./TimelineEvent.svelte";

	type Props = {
		events: Array<CalendarEvent>;
		compact: boolean;
	};
	let { events, compact }: Props = $props();

	const MIN_EVENTS_SHOWING = 15;
	let max_events_showing = $state(MIN_EVENTS_SHOWING);

	$effect(() => {
		if (events.length > 0 && events.length < max_events_showing) max_events_showing = events.length;
		if (max_events_showing < MIN_EVENTS_SHOWING && MIN_EVENTS_SHOWING <= events.length) max_events_showing = MIN_EVENTS_SHOWING;
	});
</script>

{#if events.length > 0}
	<div class="event-list">
		{#each events.slice(0, max_events_showing) as event}
			<TimelineEventComponent {event} {compact} />
		{/each}
		<div class="mx-auto">
			{#if max_events_showing > MIN_EVENTS_SHOWING}
				<button onclick={() => (max_events_showing -= 10)}>Show Less</button>
			{/if}
			{#if max_events_showing < events.length}
				<button onclick={() => (max_events_showing += 10)}>Show More</button>
			{/if}
		</div>
	</div>
{:else}
	<div class="text-2xl text-gray-400">None</div>
{/if}

<style lang="postcss">
	.event-list {
		@apply flex flex-col gap-y-4 md:gap-y-8;

		/* @apply lg:w-[60%]; */
	}

	button {
		@apply mt-4 rounded-md bg-kuretake-manga-black px-4 py-3 text-center text-lg font-medium xl:mt-8 xl:text-2xl;

		transition: opacity 200ms ease-out;

		&:hover {
			opacity: 0.8;
		}
	}
</style>
