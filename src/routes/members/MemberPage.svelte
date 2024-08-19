<script lang="ts">
	type Props = {
		officers: Array<Pick<Database.Officer, "name" | "position">>;
		primary_track_members: Array<Pick<Database.Member, "first_name" | "last_name">>;
		foundational_track_members: Array<Pick<Database.Member, "first_name" | "last_name">>;
		year_string: string;
	};
	let { officers, primary_track_members, foundational_track_members, year_string }: Props = $props();

	let search_string = $state("");

	function filteredOfficers(array: typeof officers) {
		if (search_string === "") return array;
		return array.filter((v) => {
			return v.name.toLowerCase().includes(search_string.trim().toLowerCase());
		});
	}
	function filteredMembers(array: typeof primary_track_members) {
		if (search_string === "") return array;
		return array.filter((v) => {
			return v.first_name.toLowerCase().includes(search_string.trim().toLowerCase()) || v.last_name.toLowerCase().includes(search_string.trim().toLowerCase());
		});
	}
</script>

<div class="heading">
	<h1>{year_string} Academic Year Membership</h1>
	<hr />
</div>

<div class="wrapper">
	<input type="text" bind:value={search_string} placeholder="Search Members" />

	<section class="leadership">
		<div>
			<a href="#executive-board" id="executive-board">
				<h3>Executive Board</h3>
				<hr />
			</a>
			<div class="list">
				{#each filteredOfficers(officers) as { name, position }}
					<div class="text-center">
						<div class="text-sm font-medium md:text-2xl">{name}</div>
						<div class="text-xs font-light text-haze-offwhite/80 md:text-sm">{position}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	{#if year_string !== "2023-24"}
		<section class="general-body">
			<hr />
			<h3 class="mb-8">General Body</h3>
			<div>
				<a href="#primary-track" id="primary-track">
					<h4>Primary Track Members</h4>
					<hr />
				</a>
				{#if primary_track_members.length > 0}
					<div class="list">
						{#each filteredMembers(primary_track_members) as { first_name, last_name }}
							<div>{first_name} {last_name}</div>
						{/each}
					</div>
				{:else}
					<div class="empty-list-notice">Check back at the end of the {year_string} Academic Year</div>
				{/if}
			</div>

			<div>
				<a href="#foundational-track" id="foundational-track">
					<h4>Foundational Track Members</h4>
					<hr />
				</a>
				{#if foundational_track_members.length > 0}
					<div class="list">
						{#each filteredMembers(foundational_track_members) as { first_name, last_name }}
							<div>{first_name} {last_name}</div>
						{/each}
					</div>
				{:else}
					<div class="empty-list-notice">Check back at the end of the {year_string} Academic Year</div>
				{/if}
			</div>
		</section>
	{/if}
</div>

<style lang="postcss">
	.heading {
		@apply mx-auto w-fit;

		hr {
			@apply mt-4 rounded-full border-tile-teal/50;
			border-width: 1.5px;
		}
	}
	h1 {
		@apply mt-4 text-center text-2xl font-bold md:text-4xl lg:text-5xl xl:text-6xl;
		opacity: 0.9;
	}

	.wrapper {
		@apply relative mx-auto w-full;
		max-width: 1920px;

		@apply mt-14;
		@apply lg:mt-24;

		input {
			@apply absolute right-8;

			max-width: 20%;

			@apply rounded-xl bg-dark/20 font-thin text-haze-offwhite/80;
			box-shadow: 2px 2px 10px 10px rgba(0, 0, 0, 0.5);

			@apply px-2 py-1 text-lg lg:p-3 lg:text-2xl;

			&::placeholder {
				@apply text-gray-600;
			}
		}
	}

	section {
		@apply mx-5 lg:mx-14;
		max-width: 1920px;

		hr {
			@apply mb-5 mt-3;
			border-color: #575757;
			opacity: 0.2;
		}
	}

	.leadership {
		@apply mt-4 lg:mt-8;

		.list {
			@apply grid gap-x-2;
			@apply grid-cols-3 gap-y-4;
			@apply md:gap-y-6;
			@apply lg:grid-cols-4;
			@apply xl:grid-cols-5;
		}
	}

	.general-body {
		@apply mt-12 lg:mt-32;

		a {
			@apply relative bg-blue-200;

			h4 {
				@apply sticky top-24;
			}
		}

		.list {
			display: grid;
			grid-template-columns: repeat(7, auto);
			@apply gap-x-2 gap-y-6 lg:gap-x-0;

			div {
				@apply text-center;
				@apply text-xs md:text-sm lg:text-lg;
			}
		}

		div:has(> #foundational-track) {
			@apply mt-6 md:mt-8 lg:mt-10;
		}
	}

	h3,
	h4 {
		@apply font-semibold;
	}
	h3 {
		@apply text-2xl md:text-3xl lg:text-5xl;
	}
	h4 {
		@apply text-lg md:text-xl lg:text-3xl;
	}

	.empty-list-notice {
		@apply text-sm md:text-lg lg:text-3xl;

		@apply text-center font-medium text-gray-500/90;

		@apply my-8;
	}
</style>
