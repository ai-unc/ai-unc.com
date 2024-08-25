<script lang="ts">
	import SuperDebug, { superForm } from "sveltekit-superforms";
	import { Check, Loader2, X } from "lucide-svelte";
	import { getYearString } from "$lib/utils/years.js";

	import strftime from "strftime";
	import { slide } from "svelte/transition";

	let { data } = $props();
	let { CURRENT_YEAR, DUES_DEADLINE } = data;
	let { form, errors, constraints, enhance, submitting, delayed, message } = $state(superForm(data.form));

	let id = $state<string>();
	// HACK: Idk why the first time $form gets updated the normal way it doesn't work, here is the hack
	let update_beginner_to_true = false;
	function updateBeginnerToTrue() {
		$form.is_beginner_track = true;
		update_beginner_to_true = true;
	}
	$effect(() => {
		if ($message) id = $message.id;
		if ($form.is_beginner_track === false && update_beginner_to_true) {
			$form.is_beginner_track = true;
			update_beginner_to_true = false;
		}
	});
</script>

<svelte:head>
	<title>Join | AI@UNC</title>
</svelte:head>

<!-- <SuperDebug data={$form} /> -->

<div class="heading">
	<h1><span class="text-sunburst-yellow">JOIN</span> TODAY!</h1>
	<h2>START YOUR JOURNEY TO BECOMING AN AI SOFTWARE DEVELOPER</h2>
</div>

<div class="container">
	<div id="primary-track" class="track-wrapper">
		<div>
			<div class="title">Primary Track</div>
			<div class="price text-green-400">
				<span class="text-[0.8em] text-haze-offwhite">Dues:</span> $40 <span class="cycle">/ year</span><a href="#sign-up" onclick={() => ($form.is_beginner_track = false)}
					>Sign Up <span style="font-size:0.7em">(pay dues later)</span></a
				>
			</div>
			<div class="disclaimer">We are <strong>NON-PROFIT!</strong> All dues go to our events and projects!</div>
		</div>
		<ul class="opportunities">
			<li><Check />Able to attend our Private Events (such as our Book Club)</li>
			<li><Check />Work on a yearlong AI project with other club members</li>
			<li><Check />Collaborate with professors and partner with labs/research teams</li>
			<li><Check />Develop and pursue your own idea for an application of AI</li>
			<li><Check />Receive ongoing logistical and technical support from our experienced Technical Chairs</li>
			<li><Check />Potentially acquire funding for your project</li>
			<li><Check /><strong>Opportunity to present at <a href="/events/io" class="text-azalea-pink underline">AI@UNC I/O</a></strong></li>
		</ul>
		<div class="mt-auto">
			<hr />
			<div class="prerequisites">
				<strong>Prerequisite:</strong> Have <strong>some</strong> prior programming knowledge <span class="fine-print">(COMP 110 or equivalent)</span>
			</div>
			<div class="requirements">
				<div><strong>Requirements:</strong></div>
				<ul>
					<li><strong>Time Commitment:</strong> 3-5 hours per week</li>
					<li>Attend <strong>weekly</strong> Project Support Meetings <span class="fine-print">(80% per semester)</span></li>
					<li>Required to attend our Social Events <span class="fine-print">(50% per semester)</span></li>
					<li><strong>Required to attend AI@UNC I/O in Spring</strong></li>
				</ul>
			</div>
		</div>
	</div>
	<div id="foundational-track" class="track-wrapper">
		<div>
			<div class="title">Foundational Track</div>
			<div class="price text-blue-500">
				<span class="text-[0.8em] text-haze-offwhite">Dues:</span> $10 <span class="cycle">/ year</span><a href="#sign-up" onclick={updateBeginnerToTrue}
					>Sign Up <span style="font-size:0.7em">(pay dues later)</span></a
				>
			</div>
			<div class="disclaimer">We are <strong>NON-PROFIT!</strong> All dues go to our events and projects!</div>
		</div>
		<ul class="opportunities">
			<li><Check />Able to attend our Private Events (such as our Book Club)</li>
			<li><Check />Learn to use AI tools from experts in our Foundational Workshops</li>
			<li><Check />Receive guidance and training to become confident in your technical abilities</li>
			<li class="disabled"><X style="color:#ef4444" />Work on a yearlong AI project with other club members</li>
			<li class="disabled"><X style="color:#ef4444" />Collaborate with professors and partner with labs/research teams</li>
			<li class="disabled"><X style="color:#ef4444" />Develop and pursue your own idea for an application of AI</li>
			<li class="disabled"><X style="color:#ef4444" />Receive ongoing logistical and technical support from our experienced Technical Chairs</li>
			<li class="disabled"><X style="color:#ef4444" />Potentially acquire funding for your project</li>
			<li class="disabled"><X style="color:#ef4444" /><strong>Opportunity to present at AI@UNC I/O</strong></li>
		</ul>
		<div class="mt-auto">
			<hr />
			<div class="prerequisites"><strong>Prerequisite:</strong> Be taking COMP110 in the Fall <span class="fine-print">(or equivalent)</span></div>

			<div class="requirements">
				<div><strong>Requirements:</strong></div>
				<ul>
					<li><strong>Time Commitment:</strong> 1 hour per week <span class="fine-print">(with some weeks off)</span></li>
					<li>Attend <strong>Foundational Workshops</strong> <span class="fine-print">(80% per semester)</span></li>
					<li>Required to attend our Social Events <span class="fine-print">(50% per semester)</span></li>
					<li><strong>Required to attend AI@UNC I/O in Spring</strong></li>
				</ul>
			</div>
		</div>
	</div>

	<div class="sign-up">
		<div id="sign-up" class="absolute -top-20"></div>
		<div class="form-wrapper">
			<h3>Join Now. <span class="text-green-500">Pay Later</span></h3>
			<form method="POST" action="?/join" use:enhance>
				<div class="track-select">
					<div class="options">
						<button type="button" class:active={$form.is_beginner_track === false} onclick={() => ($form.is_beginner_track = false)}>Primary Track</button>
						<button type="button" class:active={$form.is_beginner_track} onclick={() => ($form.is_beginner_track = true)}>Foundational Track</button>
					</div>
					<div class="tip">Make sure you have the right track selected! <br />You <strong>cannot</strong> join both tracks in one academic year.</div>
				</div>

				<fieldset class="fields" disabled={$submitting}>
					<label for="first_name">First Name</label>
					<input type="text" name="first_name" aria-invalid={$errors.first_name ? "true" : undefined} bind:value={$form.first_name} {...$constraints.first_name} />
					{#if $errors.first_name}<span class="invalid">{$errors.first_name}</span>{/if}

					<label for="last_name">Last Name</label>
					<input type="text" name="last_name" aria-invalid={$errors.last_name ? "true" : undefined} bind:value={$form.last_name} {...$constraints.last_name} />
					{#if $errors.last_name}<span class="invalid">{$errors.last_name}</span>{/if}

					<label for="email">UNC Email</label>
					<input type="email" name="email" aria-invalid={$errors.email ? "true" : undefined} bind:value={$form.email} {...$constraints.email} />
					{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

					{#if $errors._errors}<span class="invalid">{$errors._errors}</span>{/if}

					<input type="hidden" name="is_beginner_track" bind:value={$form.is_beginner_track} {...$constraints.is_beginner_track} />

					<div class="submit"><button disabled={$submitting}>Join the {$form.is_beginner_track ? "Foundational" : "Primary"} Track</button></div>
					<a href="/join/pay">Already signed up? Pay Now</a>
					{#if $delayed}
						<div class="absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2">
							<Loader2 class="size-full animate-spin text-gray-400 drop-shadow-lg"></Loader2>
						</div>
					{/if}
				</fieldset>
			</form>
		</div>
		{#if $message}
			<div in:slide={{ axis: "x" }} class="success-wrapper">
				<div class="success">
					<div class="title">Success!</div>
					<div class="subtitle">
						Welcome to <strong><span class="text-sunburst-yellow">AI</span>@<span class="text-web-carolina-blue">UNC</span></strong>
						for the {getYearString(CURRENT_YEAR)} Academic Year.
					</div>
					<p>You will receive a confirmation email shortly, which includes your unique Member ID for this year, along with a QR Code to use for scanning into our events.</p>
					<p>If you did not receive an email, please reach out to <a class="text-orange-400" href="mailto:contact@ai-unc.com">contact@ai-unc.com</a> immediately.</p>
					<p>We're so excited to have you as a member of the club for {CURRENT_YEAR}!</p>
					<p>The deadline for <strong>dues</strong> is {strftime("%A, %B %e at %l:%M%p", new Date(DUES_DEADLINE))}</p>
					<div class="pay-button"><a href="/join/pay{id ? '?id=' + id : ''}">Pay Now</a></div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	span {
		font-weight: inherit;
	}

	.heading {
		@apply text-center;
		text-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
	}

	h1 {
		@apply mt-4 font-extrabold leading-normal;

		font-size: 40px;
		@apply md:text-6xl lg:text-7xl xl:text-8xl;
	}
	h2 {
		font-size: 8px;
		@apply font-medium opacity-40 md:text-xs lg:text-sm xl:text-xl;
		@apply md:mt-2 xl:mt-3;
	}

	.container {
		@apply grid grid-cols-1 md:grid-cols-2;

		@apply bg-dark-900;

		width: 95%;
		max-width: 1920px;
		@apply mx-auto;
		@apply mt-4 xl:mt-8;

		@apply rounded-3xl;
		@apply border-2 border-solid border-gray-600;

		.fine-print {
			font-size: 0.5em;
		}
	}
	.track-wrapper {
		@apply p-3 xl:p-8;

		@apply border-b border-solid border-gray-800;

		@apply flex flex-col;

		@apply text-[10px] lg:text-sm xl:text-lg;

		.title {
			font-family: "Noto Sans";

			@apply font-bold;

			@apply text-xl md:text-3xl xl:text-5xl;

			@media all and (min-width: 1355px) {
				@apply text-6xl;
			}

			@apply text-haze-offwhite;

			text-shadow: 0 4px 4px rgba(0, 0, 0, 1);
		}
		.price {
			@apply text-lg md:text-2xl xl:text-[45px];

			@apply font-semibold;

			@apply mb-3 mt-3 xl:mt-6;

			text-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);

			span {
				font-weight: inherit;
			}
			.cycle {
				@apply text-gray-500;
				font-size: 0.4em;
				word-spacing: -1px;
			}

			a {
				@apply ml-2 xl:ml-6;

				@apply text-sm xl:text-lg;
				@apply px-2 py-1 xl:px-3 xl:py-2;

				@apply rounded-sm bg-dark;

				@apply text-tile-teal;

				&:hover {
					filter: brightness(1.2);
				}
			}
		}
		.disclaimer {
			@apply text-xs md:text-sm lg:text-[16px] xl:text-xl 2xl:text-2xl;
			@apply mb-2 md:mb-3 lg:mb-4;
		}
		.opportunities,
		.requirements {
			@apply text-gray-300;

			li {
				@apply mb-2;

				@apply flex items-center gap-x-1 xl:gap-x-2;

				:global(svg) {
					@apply text-green-400;

					@apply square-3 xl:square-7;

					flex-shrink: 0;
				}
			}
		}
		.opportunities li.disabled {
			@apply line-through;
			@apply text-gray-500;
		}
		hr {
			@apply border-t-2 border-gray-800 xl:mb-4;
		}
		.prerequisites {
			@apply my-2 text-gray-400 xl:my-4;

			font-size: 0.85em;
		}
		.requirements {
			ul {
				@apply mt-1 xl:mt-4;

				li {
					display: list-item;
					list-style-type: disc;
					list-style-position: inside;
				}
			}
		}
	}
	#primary-track {
		@apply pr-8;

		@apply md:border-r;
	}
	#foundational-track {
		@apply xl:pl-8;
	}

	.sign-up {
		@apply relative;

		@apply md:col-start-1 md:col-end-3;
		@apply p-2;
		@apply mb-10 mt-4 xl:mt-8;

		@apply gap-y-4;

		@apply flex items-center justify-evenly xl:items-start;

		@apply flex-col xl:flex-row;
	}

	.form-wrapper {
		h3 {
			@apply mb-4 text-center font-bold xl:mb-6;

			@apply text-2xl sm:text-3xl lg:text-4xl xl:text-5xl;
		}
		form {
			width: fit-content;
			@apply mx-auto;
		}

		:disabled {
			@apply cursor-not-allowed opacity-65;
		}

		.track-select {
			.options {
				@apply rounded-xl;

				@apply mx-auto flex overflow-hidden ring ring-base/80;

				@apply flex-col md:flex-row;

				button {
					@apply text-center font-bold;
					flex: 1;
					text-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);

					@apply py-2 text-xs lg:py-3 lg:text-sm xl:py-4 xl:text-xl;

					@apply bg-base/50;

					transition: background-color 200ms ease;

					&:hover {
						@apply bg-base/35;
					}
					&.active {
						@apply bg-base/20;
					}
				}
			}

			.tip {
				@apply text-center font-medium;
				text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

				@apply mb-4 mt-2 text-[10px] lg:text-sm xl:mb-8 xl:mt-4 xl:text-lg;
			}
		}

		.fields {
			@apply flex flex-col;

			@apply relative;

			@apply mx-auto;

			max-width: 700px;
			min-width: 300px;

			label {
				@apply text-gray-300 xl:mb-2;

				@apply text-lg xl:text-2xl;
			}
			input {
				@apply text-sm xl:text-xl;

				@apply bg-black/50;

				@apply rounded-lg ring-1 ring-haze-offwhite/80;

				@apply p-2 xl:p-4;

				@apply mb-3 xl:mb-6;

				@apply outline-none;

				&:focus-visible {
					@apply ring ring-tile-teal;

					&:invalid {
						@apply ring-red-400;
					}
				}
			}
			.invalid {
				@apply -mt-2 mb-1 text-xs text-red-800 xl:mb-4 xl:text-lg;
			}

			a {
				@apply mt-3 text-center text-medium-turquoise underline;
				font-size: 1em;
			}
		}

		.submit {
			@apply mt-4 text-center xl:mt-8;
			button {
				@apply w-full rounded-xl p-2 py-3 xl:py-6;
				box-sizing: border-box;
				@apply bg-gradient-to-br from-dark via-30% to-dark-600;

				@apply text-lg font-bold text-yellow-400 xl:text-3xl;
				text-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
			}
		}
	}
	.success {
		@apply w-[300px] xl:w-[500px];

		@apply px-2 xl:px-0;

		font-size: 10px;

		.title {
			font-family: "Noto Sans";
			@apply text-center text-4xl font-bold;

			@apply text-dasyphyllous-green;

			@apply my-2 xl:mt-0;
		}

		.subtitle {
			@apply text-center text-xs xl:text-lg;
		}
		p {
			@apply my-2 leading-normal text-haze-offwhite/90 xl:my-4;

			@apply text-[10px] xl:text-sm;
		}
		.pay-button {
			@apply bg-base font-medium;

			@apply mx-auto;
			width: fit-content;

			@apply rounded p-3;

			font-size: 1.8em;

			transition: transform, background-color, color;
			transition-duration: 300ms;
			transition-timing-function: ease-in-out;

			&:hover {
				transform: scale(1.1);
				@apply bg-base/80;
				@apply text-sunburst-yellow;
			}
		}
	}
</style>
