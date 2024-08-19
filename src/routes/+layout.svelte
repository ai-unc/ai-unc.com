<script lang="ts">
	import "../app.postcss";

	let { children } = $props();

	import { Canvas, T } from "@threlte/core";
	import GradientBackground from "$lib/components/GradientBackground/GradientBackground.svelte";
	import { onMount, setContext, type Snippet } from "svelte";
	import { page } from "$app/stores";
	import Brain from "$lib/components/3DObjects/Brain.svelte";
	import NavLink from "./NavLink.svelte";
	import SocialsLink from "$lib/components/SocialsLink/SocialsLink.svelte";

	import { browser, dev } from "$app/environment";
	import { inject } from "@vercel/analytics";
	import { onNavigate } from "$app/navigation";
	if (dev === false) inject();

	let window_width = $state(1200);
	let window_height = $state(1200);

	let scrollY = $state(0);
	let rotate = $state(0);

	onMount(() => {
		if (browser) {
			const interval_id = setInterval(() => {
				if (rotate < 10000) rotate++;
				else rotate = 0;
			}, 100);

			const mql = window.matchMedia("(min-width: 1024px)");
			mql.addEventListener("change", (event) => {
				if (event.matches) {
					is_nav_open = false;
				}
			});

			return () => {
				clearInterval(interval_id);
			};
		}
	});

	setContext("scrollY", () => scrollY);
	setContext("resolution", () => {
		return { window_width, window_height };
	});

	let is_nav_open = $state(false);
	onNavigate(() => {
		is_nav_open = false;
	});
	let noindex_pages = ["/join/pay/success"];
</script>

<svelte:window bind:outerWidth={window_width} bind:outerHeight={window_height} bind:scrollY />

<svelte:head>
	<title>AI@UNC</title>
	{#if $page.route.id && noindex_pages.includes($page.route.id)}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}
</svelte:head>

<header>
	<div class="content">
		<a href="/" class="title">
			<div class="logo">
				<img src="/logo-white.svg" alt="AI@UNC Logo" />
			</div>
			AI@UNC
		</a>
		<nav class:open={is_nav_open}>
			<ul>
				<NavLink href="/events" match_root title="Events">
					<ul class="child-list">
						<NavLink href="/events/io">AI@UNC I/O</NavLink>
						<NavLink href="/events">Timeline</NavLink>
						<!-- <NavLink href="/events/calendar">Calendar</NavLink> -->
						<NavLink target="_blank" href="https://calendar.google.com/calendar/embed?src=aiclub.unc%40gmail.com&ctz=America%2FNew_York">Calendar</NavLink>
					</ul>
				</NavLink>
				<NavLink href="/projects">Projects</NavLink>
				<NavLink href="/members" match_root title="Members">
					<ul class="child-list">
						<NavLink href="/members#executive-board">Leadership</NavLink>
						<NavLink href="/members#primary-track" class="hidden lg:block">Primary Track Members</NavLink>
						<NavLink href="/members#foundational-track" class="hidden lg:block">Foundational Track Members</NavLink>
						<span class="child-divider"></span>
						<NavLink href="/members/past-years">Past Years</NavLink>
					</ul>
				</NavLink>

				<NavLink class="join" href="/join">JOIN!</NavLink>
			</ul>
			{#if false}
				<div class="divider"></div>
				<ul>
					<NavLink href="/">Announcements</NavLink>
					<NavLink href="/">Posts</NavLink>
					<NavLink href="/">Gallery</NavLink>
					<NavLink href="/">Shop</NavLink>
				</ul>
			{/if}
			<div class="divider"></div>
			<div class="social-links">
				<SocialsLink link={"https://github.com/ai-unc"} class="square-8 md:square-7" />
				<SocialsLink link={"https://discord.com/invite/xgMmvcDDyW"} class="square-8 md:square-7" />
				<SocialsLink link={"https://www.instagram.com/ai_unc/"} class="square-8 md:square-7" />
			</div>
		</nav>
		<button class="hamburger-button" class:open={is_nav_open} onclick={() => (is_nav_open = !is_nav_open)}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</div>
	<div class="blur"></div>
</header>

<main>
	{@render children()}
</main>

<div class="gradient-background">
	<Canvas>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 0, 0]}
			on:create={({ ref }) => {
				ref.lookAt(0, 0, 0);
			}}
		/>
		<T.AmbientLight color={0xffffff} intensity={1} />
		<T.DirectionalLight position={[0, 50, 120]} />

		<GradientBackground position={[0, 0, -10]} scale={0.01} />
		{#if $page.url.pathname === "/" && window_width > 640}
			<Brain position={[-3, -4.5, -9]} rotation={[0, scrollY / 1000 + 4 + rotate / 1000, 0]} scale={0.022} />
		{/if}
	</Canvas>
</div>

<footer class="h-48 w-full"></footer>

<style lang="postcss">
	header {
		@apply sticky top-0;

		@apply bg-black/20;

		height: 50px;
		@apply md:h-[65px];
		@apply xl:h-[80px];
		z-index: 50;

		.content {
			@apply relative flex h-full items-center justify-between;
			z-index: 15;

			@apply px-2 md:px-4 lg:px-5 xl:px-6;

			max-width: 1900px;
			@apply mx-auto;

			.title {
				@apply flex items-center gap-x-2;

				@apply hover:scale-[1.05];
				transition: transform 500ms ease-out;

				font-family: "Noto Sans";
				font-weight: 700;

				@apply text-lg md:text-xl lg:text-2xl xl:text-3xl;

				.logo {
					@apply overflow-clip rounded-sm;

					@apply square-8 md:square-9 lg:square-10 xl:square-12;
				}
			}
		}

		.hamburger-button {
			@apply square-5 md:square-6;

			@apply relative;

			@apply lg:hidden;

			&.open span {
				&:nth-child(2) {
					transform: translateY(-50%) rotate(45deg);
				}
				&:nth-child(3) {
					transform: translateY(-50%) rotate(-45deg);
				}
				&:first-child,
				&:last-child {
					opacity: 0;
					transform: scale(0.2);
				}
			}

			span {
				position: absolute;
				display: block;
				width: 100%;
				height: 2px;
				@apply md:h-[3px];

				@apply bg-haze-offwhite/90;
				@apply rounded-xl;

				transition:
					transform 200ms ease-out,
					opacity 250ms ease-out;

				&:first-child {
					top: 15%;
				}
				&:nth-child(2),
				&:nth-child(3) {
					top: 50%;
					transform: translateY(-50%);
				}
				&:last-child {
					bottom: 15%;
				}
			}
		}

		nav {
			@apply items-center;
			top: 0;
			left: 0;

			@apply fixed lg:static;

			@apply h-full w-full bg-black/90 lg:bg-transparent;
			@apply lg:h-1/2;

			@apply justify-center gap-y-4;
			@apply lg:justify-end;

			@apply flex-col lg:flex-row;

			@apply hidden lg:flex;
			&.open {
				@apply flex;
			}
		}

		nav ul {
			@apply flex gap-x-2;

			@apply flex-col lg:flex-row lg:items-center;
			@apply gap-y-5;

			.child-list {
				@apply lg:px-2 lg:py-4;

				@apply flex-col;

				@apply mt-1 lg:mt-0;
				@apply gap-y-1 lg:gap-y-4;

				@apply lg:absolute lg:left-1/2 lg:hidden lg:-translate-x-1/2;

				width: 200px;
				z-index: 50;

				:global(li) {
					@apply text-center;

					:global(a) {
						@apply text-sm lg:text-[0.9em];
						/* font-size: 0.98rem; */
						padding: 0;

						@apply p-1;
					}
				}

				.child-divider {
					@apply hidden lg:block;
					height: 1px;
					@apply w-full;
					@apply bg-haze-offwhite/80;
				}
			}
		}

		nav .divider {
			@apply block self-stretch bg-gray-500;
			width: 1.5px;

			@apply mx-3;
		}

		nav .social-links {
			@apply flex gap-x-3 md:gap-x-4;
		}

		.blur {
			@apply absolute left-0 top-0 w-full;
			height: 150%;
			@apply pointer-events-none select-none;

			@apply backdrop-blur-md;
			mask: linear-gradient(black, rgba(0, 0, 0, 0.75), transparent);
		}
	}

	.gradient-background {
		@apply fixed left-0 top-0 -z-50 h-screen w-screen overflow-hidden;

		@apply min-h-[700px] md:min-h-[800px] xl:min-h-[1000px];

		background: linear-gradient(
			145deg,
			rgba(2, 40, 64, 1) 0%,
			rgba(37, 44, 70, 1) 5%,
			rgba(0, 20, 26, 1) 25%,
			rgba(0, 20, 26, 1) 50%,
			rgba(0, 20, 26, 1) 75%,
			rgba(1, 36, 46, 1) 95%,
			rgba(2, 40, 64, 1) 100%
		);

		/* display: none; */

		:global(canvas) {
			/* display: none; */
		}

		/* :global(div) {
			display: contents !important;
		} */
	}
</style>
