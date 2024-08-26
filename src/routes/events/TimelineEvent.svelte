<script lang="ts">
	import { Blocks, BrainCircuit, Cookie, LockOpen, RefreshCw, Utensils } from "lucide-svelte";

	let { event, compact: _compact }: { event: CalendarEvent; compact: boolean } = $props();

	const today = new Date();
	const next_week = new Date(today.setDate(today.getDate() + 7));
	let compact = $derived(_compact && event.id.includes("_") && (event.start.dateTime > next_week.toISOString() || event.start.dateTime < today.toISOString()));
</script>

<div class="event" class:compact>
	<!-- <div>{event.id}</div> -->
	<!-- <div>{event.id.split("_")}</div> -->
	<!-- <pre>{JSON.stringify(event.data)}</pre> -->
	<!-- <pre>{JSON.stringify(event.start)}</pre> -->
	<div class="heading">
		{#if event.data?.main_post}
			<a href="/posts/{event.data.main_post}" class="title">{event.summary}</a>
		{:else if event.summary === "AI@UNC I/O"}
			<a href="/events/io" class="title">{event.summary}</a>
		{:else}
			<div class="title">{event.summary}</div>
		{/if}
		<div class="icons">
			{#if event.data}
				{#if event.data.tags.includes("food")}
					<div class="icon" title="Food Available"><Utensils /></div>
				{/if}
				{#if event.data.tags.includes("snacks")}
					<div class="icon" title="Snacks Available"><Cookie /></div>
				{/if}
				{#if event.data.tags.includes("cle")}
					<div class="icon" title="CLE Credit">
						<img src="/cle.svg" alt="Campus Life Experience Logo" />
					</div>
				{/if}
				{#if event.data.is_public}
					<div class="icon" title="Open to the Public"><LockOpen /></div>
				{/if}
				{#if event.data.tags.includes("beginner_track")}
					<div class="icon" title="Exclusive to Foundational Track Members"><Blocks /></div>
				{:else if event.data.tags.includes("technical_track")}
					<div class="icon" title="Exclusive to Primary Track Members"><BrainCircuit /></div>
				{/if}
			{/if}
			{#if event.id.includes("_")}
				<div class="icon" title="Recurring Event"><RefreshCw class="text-dasyphyllous-green" /></div>
			{/if}
			<a class="icon" href={event.htmlLink} target="_blank" title="Add to Google Calendar">
				<img src="/Google_Calendar.svg" alt="Google Calendar Logo" />
			</a>
		</div>
	</div>
	<div class="datetime">
		{new Date(event.start.dateTime).toLocaleString("en-US", {
			timeZone: event.start.timeZone,
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		})}
	</div>
	{#if compact === false}
		<div class="location">{event.location}</div>
		<p>{@html event.description?.replaceAll("<a", '<a target="_blank" ').replaceAll("\n", "<br>")}</p>
	{/if}
</div>

<style lang="postcss">
	.event {
		@apply rounded-2xl p-2 outline outline-2 outline-gray-400 md:p-4;

		&.compact {
			@apply opacity-75;
		}
	}
	.heading {
		@apply flex gap-x-4;

		.title {
			@apply text-lg font-semibold md:text-2xl lg:text-3xl;
		}
		a.title {
			@apply text-blue-300;
		}
		.icons {
			@apply ml-auto mr-2 flex gap-x-2;

			.icon {
				@apply text-gray-300 square-6;

				:global(svg),
				img {
					@apply h-full w-full py-0.5;
				}
				:global(svg) {
					stroke-width: 2.5px;
				}
				img {
					@apply grayscale-[30%];
				}
			}
		}
	}

	.datetime {
		@apply text-sm md:text-lg lg:text-2xl;
	}
	.location {
		@apply text-xs text-gray-400 md:text-sm lg:text-lg;
	}
	p {
		@apply mt-4 overflow-hidden text-xs text-gray-300 md:text-sm lg:text-[1rem];

		:global(a) {
			@apply text-blue-400;
		}
	}
</style>
