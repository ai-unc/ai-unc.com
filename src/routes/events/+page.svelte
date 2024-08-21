<script lang="ts">
	import { fade } from "svelte/transition";
	import TimelineEventList from "./TimelineEventList.svelte";
	import { ArrowUp, Check, ChevronDown, Cookie, LockOpen, Utensils } from "lucide-svelte";

	let { data } = $props();

	let y = $state(0);

	let upcoming_events = $state<Array<CalendarEvent>>([]);
	let past_events = $state<Array<CalendarEvent>>([]);
	function updateEventsWithData(new_events: Array<CalendarEvent>) {
		data.events_data.forEach((d) => {
			const matching_events = new_events.filter((e) => e.id.split("_")[0] === d.id);
			for (const event of matching_events) {
				event.data = { type: d.type, is_public: d.is_public, tags: d.tags, main_post: d.main_post };
			}
		});
		return new_events;
	}
	let filtered_upcoming_events = $derived(filterEvents(upcoming_events));
	let filtered_past_events = $derived(filterEvents(past_events));

	type EventTypeAndOther = Database.Enums.EventType | null;
	const EVENT_TYPES_FILTER_OPTIONS: Array<{ value: EventTypeAndOther; label: string }> = [
		{
			value: "audience_event",
			label: "Audience Event",
		},
		{
			value: "major_event",
			label: "Major Event",
		},
		{
			value: "workshop",
			label: "Foundational Workshop",
		},
		{
			value: "social",
			label: "Social Event",
		},
		{
			value: null,
			label: "Other",
		},
	];
	function countEvents(events: Array<CalendarEvent>, type: EventTypeAndOther): number {
		if (type === null) return events.filter((e) => e.data == undefined || e.data.type === null).length;
		if (type === "audience_event") return events.filter((e) => e.data?.type === type || e.data?.type === "major_event").length;
		return events.filter((e) => e.data?.type === type).length;
	}
	let selected_event_types: Array<EventTypeAndOther> = $state([]);
	function toggleTypeSelection(value: EventTypeAndOther) {
		const i = selected_event_types.indexOf(value);
		if (i > -1) selected_event_types.splice(i, 1);
		else selected_event_types.push(value);
	}

	let is_public_filter = $state(false);
	function toggleIsPublicFilter() {
		is_public_filter = !is_public_filter;
	}

	let selected_event_tags: Array<Database.Enums.EventTag> = $state([]);
	function toggleTagSelection(value: Database.Enums.EventTag) {
		const i = selected_event_tags.indexOf(value);
		if (i > -1) selected_event_tags.splice(i, 1);
		else selected_event_tags.push(value);
	}

	type RecurringEventsDisplayOptions = "only_recurring" | "no_recurring" | "compact" | "both";
	let show_recurring_setting: RecurringEventsDisplayOptions = $state("both");
	const RECURRING_EVENTS_DISPLAY_OPTIONS: Array<{ value: RecurringEventsDisplayOptions; label: string }> = [
		{
			value: "both",
			label: "Show Recurring",
		},
		{
			value: "no_recurring",
			label: "Hide Recurring",
		},
		{
			value: "only_recurring",
			label: "Show Only Recurring",
		},
		// TODO: Add this somehow lol
		// {
		// 	value: "compact",
		// 	label: "Show Recurring Events with a Date Range",
		// },
	];

	function filterEvents(events: Array<CalendarEvent>) {
		return events.filter((event) => {
			if (show_recurring_setting === "no_recurring" && event.id.split("_").length > 1) {
				return false;
			} else if (show_recurring_setting === "only_recurring" && event.id.split("_").length <= 1) {
				return false;
			}

			selected: if (selected_event_types.length > 0) {
				if (selected_event_types.indexOf(null) > -1 && (event.data === undefined || event.data.type === undefined)) break selected;
				if (event.data === undefined) return false;
				if (event.data.type === "major_event" && selected_event_types.indexOf("audience_event") > -1) break selected;
				if (selected_event_types.indexOf(event.data.type) === -1) return false;
			}

			if (is_public_filter && (event.data === undefined || event.data.is_public === false)) return false;

			if (selected_event_tags.length > 0) {
				if (event.data === undefined) return false;
				if (selected_event_tags.length > event.data.tags.length) return false;
				for (const tag of selected_event_tags) {
					if (event.data.tags.indexOf(tag) === -1) return false;
				}
			}

			return true;
		});
	}

	import { createCollapsible, melt } from "@melt-ui/svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	const {
		elements: { root, trigger, content },
		states: { open },
	} = createCollapsible({
		onOpenChange: ({ next }) => {
			if (is_mql_matching) {
				return true;
			} else return next;
		},
	});

	let is_mql_matching = $state(false);

	onMount(() => {
		if (browser) {
			const mql = window.matchMedia("(min-width: 1280px)");
			mql.addEventListener("change", (event) => {
				is_mql_matching = event.matches;
				if (event.matches) {
					open.set(true);
				} else {
					open.set(false);
				}
			});
			is_mql_matching = mql.matches;
			if (is_mql_matching) {
				open.set(true);
			}
		}
	});
</script>

<svelte:head>
	<title>Events | AI@UNC</title>
</svelte:head>

<svelte:window bind:scrollY={y} />

{#if y > 350}
	<button
		class="fixed bottom-4 right-4 z-20 rounded-3xl bg-dark p-2 transition-transform square-8 hover:scale-110 md:bottom-5 md:right-5 md:p-4 md:square-12"
		transition:fade={{ duration: 100 }}
		onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
	>
		<ArrowUp class="h-full w-full stroke-sunburst-yellow" />
	</button>
{/if}

<section>
	<div use:melt={$root} class="filters">
		<div class="heading">
			Filters
			<hr />
			{#if is_mql_matching === false}
				<br />
				<button use:melt={$trigger}>
					<ChevronDown class={$open ? "" : "-rotate-90"} />
				</button>
			{/if}
		</div>
		<div use:melt={$content} class="content">
			<div class="event-types">
				<div class="title">Event Types <span class="font-light">- Upcoming(Total)</span></div>
				<div class="options">
					{#each EVENT_TYPES_FILTER_OPTIONS as event_type}
						{@const total_upcoming = countEvents(upcoming_events, event_type.value)}
						{@const total_past = countEvents(past_events, event_type.value)}
						<button class={event_type.value === "major_event" ? "pl-4" : ""} onclick={() => toggleTypeSelection(event_type.value)}>
							<div class="check">
								{#if selected_event_types.indexOf(event_type.value) > -1}
									<Check />
								{/if}
							</div>
							<div class="label">{event_type.label} - {total_upcoming}({total_upcoming + total_past})</div>
						</button>
					{/each}
				</div>
			</div>
			<div class="is-public">
				<button onclick={toggleIsPublicFilter}>
					<div class="check">
						{#if is_public_filter}
							<Check />
						{/if}
					</div>
					<div class="icon"><LockOpen /></div>
					Is Public
				</button>
				<div>Whether the Event is open to the public</div>
			</div>
			<div class="event-tags">
				<div class="title">Event Tags</div>
				<div class="options">
					<button onclick={() => toggleTagSelection("cle")}>
						<div class="label">
							<div class="check">
								{#if selected_event_tags.indexOf("cle") > -1}
									<Check />
								{/if}
							</div>
							<div class="icon"><img src="/cle.svg" alt="Campus Life Experience Logo" /></div>
							CLE Credit
						</div>
					</button>
					<button onclick={() => toggleTagSelection("food")}>
						<div class="label">
							<div class="check">
								{#if selected_event_tags.indexOf("food") > -1}
									<Check />
								{/if}
							</div>
							<div class="icon"><Utensils /></div>
							Food
						</div>
					</button>
					<button onclick={() => toggleTagSelection("snacks")}>
						<div class="label">
							<div class="check">
								{#if selected_event_tags.indexOf("snacks") > -1}
									<Check />
								{/if}
							</div>
							<div class="icon"><Cookie /></div>
							Snacks
						</div>
					</button>
				</div>
			</div>
			<div class="recurring">
				{#each RECURRING_EVENTS_DISPLAY_OPTIONS as option}
					<button class:active={show_recurring_setting === option.value} onclick={() => (show_recurring_setting = option.value)}>{option.label}</button>
				{/each}
			</div>
		</div>
	</div>
	<div class="timeline">
		<div>
			<h1>Upcoming Events ({filtered_upcoming_events.length})</h1>
			{#await data.events}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="70"
					height="70"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#f1f1f1"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg
				>
			{:then r}
				{console.assert(
					(upcoming_events = updateEventsWithData(r)),
					// (upcoming_events = updateEventsWithData([
					// 	...r,
					// 	{
					// 		id: "id",
					// 		summary: "AI@UNC I/O",
					// 		start: { dateTime: "2025-04-15T18:00:00-04:00", timeZone: "America/New_York" },
					// 		location: "SN115",
					// 		description: "End of year event",
					// 		htmlLink: "a",
					// 	},
					// ])),
				)}
				<TimelineEventList events={filtered_upcoming_events}></TimelineEventList>
			{/await}

			<h2 id="past-events">Past Events ({filtered_past_events.length})</h2>
			{#await data.past_events}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="70"
					height="70"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#f1f1f1"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg
				>
			{:then r}
				{console.assert((past_events = updateEventsWithData(r)))}
				<TimelineEventList events={filtered_past_events}></TimelineEventList>
			{/await}
		</div>
	</div>
</section>

<style lang="postcss">
	h1,
	h2 {
		@apply mb-8 text-3xl font-bold text-gray-200 md:text-5xl;
	}
	h2 {
		@apply mt-14 md:mt-20;
	}

	section {
		@apply xl:grid;
		grid-template-columns: 1.5fr 1fr;
		@apply gap-x-5;

		@apply mx-3 mt-4 xl:mx-auto xl:mt-10 xl:w-[90%];

		@apply relative;
	}
	.filters {
		grid-column: 2;

		@apply sticky top-14 z-10 sm:top-24;

		@apply mb-8 xl:mb-0 xl:ml-8 2xl:ml-14;

		@apply bg-gradient-to-br from-gray-900 to-gray-950 xl:bg-base/20;
		@apply rounded-md p-4 ring-haze-offwhite/80 xl:p-8 xl:ring-[1px];

		height: fit-content;

		.heading {
			@apply w-fit text-xl font-medium xl:text-3xl;

			hr {
				width: 100%;
				@apply mb-6 mt-2 hidden xl:block;
			}

			button {
				@apply p-3 pl-0;
			}
		}
		.content {
			@apply mt-2 flex flex-col gap-y-8;
		}

		.title {
			@apply mb-3 text-sm font-medium xl:text-xl;
		}

		.check {
			@apply rounded-sm outline outline-2 outline-haze-offwhite/90 square-3 xl:rounded-lg xl:square-6;

			:global(svg) {
				@apply xl:p-[3px];
				height: 100%;
				width: 100%;
			}
		}

		button {
			.icon {
				@apply square-4 xl:square-6;

				:global(svg),
				img {
					@apply h-full w-full;

					@apply text-haze-offwhite/80;

					filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.25)) drop-shadow(-1px -1px 1px rgb(0 0 0 / 0.25)) drop-shadow(-1px 1px 1px rgb(0 0 0 / 0.25))
						drop-shadow(1px -1px 1px rgb(0 0 0 / 0.25));
				}
			}
		}

		.event-types,
		.event-tags {
			button {
				@apply flex items-center gap-x-2;

				.label {
					@apply text-xs xl:text-lg;
				}
			}

			.options {
				@apply flex flex-col gap-y-4;
			}
		}

		.is-public {
			button {
				column-gap: 3px;
				@apply flex items-center xl:gap-x-2;

				@apply text-sm xl:text-xl;

				@apply mb-3;
			}
			div {
				@apply text-sm text-haze-offwhite/80;
			}
			.check {
				@apply mr-1;
			}
		}

		.event-tags button .label {
			@apply flex items-center gap-x-1;

			.check {
				@apply mr-2;
			}
		}

		.recurring {
			@apply flex flex-col xl:flex-row;

			button {
				@apply bg-base/60 py-2 text-center text-sm xl:p-4;

				&.active {
					@apply bg-base/20;
				}

				&:first-child {
					@apply rounded-t-lg;
					@apply xl:rounded-t-none;
					@apply xl:rounded-l-lg;
				}
				&:last-child {
					@apply rounded-b-lg xl:rounded-b-none xl:rounded-r-lg;
				}
			}
		}
	}
	.timeline {
		@apply flex;
		grid-row: 1;
	}
</style>
