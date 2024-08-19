<script lang="ts">
	import { enhance } from "$app/forms";
	let { data, form } = $props();

	let id = $state(data.id ?? "");
	let member_data: Database.Member | undefined = $state(data.member_data);

	$effect(() => {
		if (form && form.member_data) {
			member_data = form.member_data;
			id = form.member_data.id;
		}
	});
</script>

<svelte:head>
	<title>Pay | AI@UNC</title>
</svelte:head>

<form action={member_data ? "?/pay" : "?/verify"} method="POST" use:enhance>
	<h1>Pay</h1>

	{#if form?.error}
		<div class="error">{form.error}</div>
	{/if}

	<label>
		<strong>ID:</strong>
		<input name="id" type="text" bind:value={id} required />
	</label>
	{#if member_data}
		<div>Pay now for {member_data.first_name} {member_data.last_name} ({member_data.email})?</div>
		<input name="email" type="hidden" bind:value={member_data.email} required />
		<input name="track" type="hidden" bind:value={member_data.track} required />
		<button>Pay Now</button>
	{:else}
		<button>Verify ID</button>
	{/if}
</form>

<style lang="postcss">
	form {
		@apply rounded-3xl;
		@apply border-2 border-solid border-gray-600;

		width: 90%;

		@apply mx-auto mt-4 xl:w-1/2;

		@apply xl:p-6;
	}
	h1 {
		@apply mt-4 text-center text-2xl font-bold md:text-4xl lg:text-5xl xl:text-6xl;

		@apply mb-4;
	}
	form {
		font-size: 20px;
		@apply flex flex-col text-center;
	}
	.error {
		@apply my-3 text-red-700;
	}
	input {
		@apply bg-transparent;

		@apply ml-2 rounded p-1 ring ring-gray-800;

		@apply w-1/2;

		@apply outline-none;

		@apply mb-4;

		&:focus-visible {
			@apply ring-tile-teal;
		}
	}
	button {
		@apply mt-4;
		@apply rounded bg-base p-3;
		font-size: 1.2em;
		@apply font-semibold;
		width: fit-content;
		@apply self-center;
	}
</style>
