<script lang="ts">
	import { UsersRound } from "lucide-svelte";

	let { data } = $props();
	let active_projects = data.projects.filter((p) => !p.stop);
	let inactive_projects = data.projects.filter((p) => p.stop);

	import { replaceDateCodeWithText } from "./replaceDateCodeWithText";
	import { buildProjectSlug } from "./buildProjectSlug";
</script>

<svelte:head>
	<title>Projects | AI@UNC</title>
</svelte:head>

<h1>Student-Led Projects</h1>

<div class="cards">
	{#snippet card(project: Database.Project)}
		<div class="card" style="border-color:{project.color};">
			<div class="heading">
				<h2 class="card-title">{project.title}</h2>
				{#if project.subtitle}<h4 class="card-subtitle">{project.subtitle}</h4>{/if}
				<div class="card-date">
					{replaceDateCodeWithText(project.start)} - {#if project.stop}
						{replaceDateCodeWithText(project.stop)}
					{:else}
						Present
					{/if}
				</div>
			</div>
			<div class="icon-wrapper">
				{#if project.icon_svg_code}
					{@html project.icon_svg_code}
				{/if}
			</div>
			<!-- <div class="actions">
				<div class="card-view-team-action"><button><UsersRound /> View the Team</button></div>
				{#if project.details}
					<div class="card-view-info-actions">
						{#if project.details}
							<a href="/projects/{buildProjectSlug(project.title, project.id)}">Read Details</a>
						{/if}
						<a href="/">More Posts</a>
					</div>
				{/if}
			</div> -->
		</div>
	{/snippet}
	{#each active_projects as project}
		{@render card(project)}
	{/each}
	{#each inactive_projects as project}
		{@render card(project)}
	{/each}
</div>

<style lang="postcss">
	h1 {
		@apply mb-10 mt-4 text-center text-2xl font-bold md:text-4xl lg:text-5xl xl:text-6xl;
		opacity: 0.9;
	}

	.cards {
		@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
		@apply gap-y-8;
		/* @apply bg-green-600; */
	}

	.card {
		width: 95%;
		max-width: 320px;
		/* @apply max-w-[200px] md:max-w-[350px]; */

		@apply mx-auto;
		@apply border-t-4 border-solid border-azalea-pink p-4 text-haze-offwhite;
		@apply bg-gradient-to-br from-dark-600 via-30% to-dark-900;

		@apply flex flex-col items-center justify-between;

		transition: transform 300ms ease-in-out;

		&:hover {
			transform: scale(1.02);
		}

		.heading {
			@apply text-center;

			/* @apply bg-blue-400; */
		}
		.icon-wrapper {
			@apply square-[300px];

			/* @apply bg-orange-400; */

			:global(svg) {
				@apply size-full;
			}
		}
		.actions {
			/* @apply bg-red-600; */
			@apply flex flex-col gap-y-4;
		}
	}
	.card-title {
		@apply text-4xl font-bold;
	}
	.card-subtitle {
		@apply text-lg text-haze-offwhite/90;
	}
	.card-date {
		@apply mt-4 italic text-haze-offwhite/70;
	}
	.card-view-team-action button {
		@apply mx-auto flex items-center justify-center;
		column-gap: 6px;

		@apply py-4;

		transition: transform 300ms ease-out;
		&:hover {
			transform: scale(1.05);
		}
	}
	.card-view-info-actions {
		@apply flex justify-center gap-x-2;

		a {
			@apply rounded-md p-4 ring-1 ring-haze-offwhite;

			transition: background-color 150ms ease-in-out;

			&:hover {
				@apply bg-haze-offwhite/20;
			}
		}
	}
</style>
