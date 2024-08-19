<script lang="ts">
	import { replaceDateCodeWithText } from "../replaceDateCodeWithText.js";

	let { data } = $props();

	let leads = [];
	let members = [];
	let former = [];

	for (const member of data.project.members as Array<Database.ProjectMember>) {
		// @ts-ignore
		if (member.former) {
			former.push(member);
			// @ts-ignore
		} else if (member.role === "lead") {
			leads.push(member);
		} else {
			members.push(member);
		}
	}
</script>

<section>
	<div class="heading">
		<h1>{data.project.title}</h1>
		{#if data.project.subtitle}<h2 class="card-subtitle">{data.project.subtitle}</h2>{/if}
		<div class="date">
			{replaceDateCodeWithText(data.project.start)} - {#if data.project.stop}
				{replaceDateCodeWithText(data.project.stop)}
			{:else}
				Present
			{/if}
		</div>
	</div>
	<div>
		<strong>
			Team Lead{#if leads.length > 1}s{/if}:
		</strong>
		{#each leads as lead, i}
			{lead.name}{#if i < leads.length - 1},&nbsp{/if}
		{/each}
		<br />
		<strong>Members:</strong>
		{#each members as member, i}
			{member.name}{#if i < members.length - 1},&nbsp{/if}
		{/each}
		<br />
		<strong>Former Members:</strong>
		{#each former as member, i}
			{member.name}{#if i < members.length - 1},&nbsp{/if}
		{/each}
	</div>

	{#if data.project.details}
		<div class="details">
			{@html data.project.details}
		</div>
	{/if}
</section>

<style lang="postcss">
	section {
		@apply mx-auto;
		width: 95%;
		max-width: 1920px;
	}
	.heading {
		@apply flex flex-col gap-y-2 text-center;
	}
	h1 {
		@apply mt-4 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl;
		opacity: 0.9;
	}
	h2 {
		@apply text-2xl;
	}
	.date {
		@apply text-xl text-haze-offwhite/80;
	}
</style>
