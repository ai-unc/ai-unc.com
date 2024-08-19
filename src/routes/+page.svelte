<script lang="ts">
	import { JOIN_DEADLINE } from "$lib/utils/CONSTANTS";
	import { ArrowRight, Blocks, CalendarDays } from "lucide-svelte";
	import strftime from "strftime";
	import { getContext } from "svelte";
	import { optimize } from "$lib/utils/image_optimization";

	let scrollY = getContext<() => number>("scrollY");
	let resolution = getContext<() => { window_width: number; window_height: number }>("resolution");

	let hero_element = $state<HTMLElement>();
	let hero_element_scroll_progress = $state(0);

	let foundational_track_element = $state<HTMLElement>();
	let foundational_track_element_scroll_progress = $state(0);

	function quadInOut(t: number) {
		t /= 0.5;
		if (t < 1) return 0.5 * t * t;
		t--;
		return -0.5 * (t * (t - 2) - 1);
	}

	function getHeroTitleScrollStyle() {
		return;
		const SIZE_START = resolution().window_height * 0.1;
		const SIZE_STOP = resolution().window_height * 0.12;
		const size_progress = scrollY() - SIZE_START < SIZE_STOP ? Math.max(0, scrollY() - SIZE_START) / SIZE_STOP : 1;
		const size_style = scrollY() < SIZE_START ? "" : "scale(" + Math.max(0.5, 1 - size_progress) + ") ";

		// const position_y_progress = scrollY() < resolution().window_height ? scrollY() / resolution().window_height : 1;
		// const position_y_style = "translateY(" + quadInOut(position_y_progress) * 100 ** 1.4 + "px)";
		return "transform:" + size_style; //+ position_y_style + ";";
	}

	function getHeroBodyScrollStyle() {
		return;
		const START = resolution().window_height * 0.1;
		const MIDPOINT_START = resolution().window_height * 0.3;
		const MIDPOINT_END = resolution().window_height * 0.5;
		const ENDPOINT = resolution().window_height * 0.7;
		let size_progress = 0.6;
		const position_y_progress = Math.max(0, scrollY() - START) / (ENDPOINT - START);
		if (scrollY() > START && scrollY() < MIDPOINT_END) {
			size_progress = Math.min(1, Math.max(0, scrollY() - START) / (MIDPOINT_START - START) + 0.6);
		} else if (scrollY() >= MIDPOINT_END) {
			size_progress = Math.max(0.4, 1 - (Math.max(0, scrollY() - MIDPOINT_END) / (ENDPOINT - MIDPOINT_END)) * 0.5);
		}
		const size_style = "scale(" + quadInOut(size_progress) + ") ";

		const position_y_style = "translateY(" + (scrollY() / 2 - position_y_progress * 200) + "px)";
		return "transform:" + size_style + position_y_style + ";";
	}

	function getCtaScrollStyle() {
		return;
		const START = resolution().window_height * 0.48;
		const MIDPOINT = resolution().window_height * 0.9;
		const ENDPOINT = resolution().window_height * 1.2;

		return scrollY() > ENDPOINT
			? "transform: translateY(-" + ((ENDPOINT - MIDPOINT) * (scrollY() - ENDPOINT)) / 100 + "px)"
			: scrollY() > MIDPOINT
				? "transform: translateY(" + (Math.min((ENDPOINT - MIDPOINT) / 100, Math.max(0, scrollY() - MIDPOINT)) + 10) + "px)"
				: "transform: translateY(" + Math.max(0, 100 - (scrollY() - START) / 2) + "vh)";
	}

	function getEventsScrollStyle() {
		return;
		const ENDPOINT = resolution().window_height * 1.6;
		return scrollY() < ENDPOINT ? "transform: translateY(" + ((ENDPOINT - scrollY()) / ENDPOINT) * 205 + "vh);" : "";
	}

	function calculateElementScrollProgress(element: HTMLElement, offset: number = 0): number {
		return Math.min(1, Math.max(0, scrollY() - element.offsetTop + offset) / (element.clientHeight + offset));
	}

	function handleScroll() {
		foundational_track_element_scroll_progress = calculateElementScrollProgress(foundational_track_element!, 800);
	}
</script>

<svelte:window onscroll={handleScroll} />

<section class="hero">
	<div class="heading origin-top-left" style={getHeroTitleScrollStyle()}>
		<h1 style="font-variation-settings: 'wght' 800;">
			<span class="text-sunburst-yellow">AI</span>@<span class="text-web-carolina-blue">UNC</span>
		</h1>
		<h2 style="font-family: 'Poppins';">Bringing AI to every UNC student through exploration and application</h2>
	</div>

	<div class="body origin-right" style={getHeroBodyScrollStyle()}>
		<p>
			<strong><span class="text-sunburst-yellow">AI</span>@<span class="text-web-carolina-blue">UNC</span></strong> was founded to break the barriers that limit student engagement with
			AI at the University.
		</p>
		<br />
		<p>
			Our club partners our <a href="/members" class="text-azalea-pink underline">members</a> with <strong>faculty</strong>, <strong>research teams</strong>, <strong>labs</strong>,
			and
			<strong>each other</strong> in order to pursue meaningful technical work, building impactful tools on
			<a href="/projects" class="font-bold text-tile-teal underline">Student-Led Project teams</a>.
		</p>
		<br />
		<p>
			Students are given support from our experienced <a href="/members#executive-board" class="font-bold text-sunburst-yellow underline">Technical Chairs</a> throughout the year, who
			help guide the project, anticipate challenges, and ensure productivity.
		</p>
		<br />
		<p>
			Students then have the opportunity to present their work to faculty, industry, and their peers at our end of year
			<a href="/events/io" class="text-azalea-pink underline">
				<strong>AI@UNC I/O event</strong>
			</a>.
		</p>
	</div>
</section>
<section class="cta" style={getCtaScrollStyle()}>
	<div class="wrapper" style="background-color:#00979E;">
		<div class="content">
			<div class="backdrop-wrapper">
				<img class="backdrop" src="/student-project-teams.png" srcset={optimize("/student-project-teams.png")} alt="Some AI@UNC members working on a project" />
			</div>
			<h2>Student-Led Projects</h2>
			<p>
				Project teams provide an exciting opportunity to immerse yourself in the dynamic field of AI. Work on real technical applications using artificial intelligence in a group
				setting. Receive financial and technical support while gaining valuable skills. Check out some of our <a class="font-medium underline" href="/projects">projects here</a>.
			</p>
			<a class="cta-button bg-dark" href="/join"><span>Join Now</span></a>
			<div class="deadline">Deadline: {strftime("%m/%d/%Y", new Date(JOIN_DEADLINE))}</div>
		</div>
	</div>
	<div class="wrapper" style="background:linear-gradient(300deg, rgba(2,31,46,1) 0%, rgba(3,35,52,1) 70%);">
		<div class="content">
			<h2>AI@UNC I/O</h2>
			<p>
				AI@UNC I/O is the culminating end of year event for the club. Members will present their year-long projects to faculty, industry recruiters, engineers, students, and their
				family members. Each project has the opportunity to present a poster at tabling inside the venue, interspersed with spotlight stage presentations during designated time
				slots.
			</p>
			<a class="cta-button bg-tile-teal/30" href="/events/io"><span>Learn More</span></a>
		</div>
	</div>
</section>
<section class="events" style={getEventsScrollStyle()}>
	<div class="heading">
		<a href="/events">
			<h2><CalendarDays /> Events</h2>
			<hr />
		</a>
	</div>

	<div class="event-offerings">
		<div class="wrapper" style="background-color:#B3375A;">
			<div class="event-offering ml-auto">
				<h3>Social Events</h3>
				<p>
					Ready to unwind and connect with other club members in a relaxed and fun setting? We host a variety of Social Events. These gatherings are perfect for making new friends
					and sharing interests, whether you're into games, casual conversations, or just want free food and snacks.
				</p>
			</div>
		</div>
		<div class="event-offering" style="background-color:#359A93;">
			<div class="backdrop-wrapper">
				<img class="backdrop" src="/major-events.jpg" srcset={optimize("/major-events.jpg")} alt="Some AI@UNC members working on a project" />
			</div>
			<h3>Major Events</h3>
			<p>
				For those more interested in learning about recent developments in the industry, understanding and debating the ethics of emerging technologies, along with other exciting
				and important areas of discussion, we host large events open to the public, including presentations from notable figures in AI.
			</p>
		</div>
		<div class="wrapper" style="background-color:#BFA207;">
			<div class="event-offering">
				<h3>And More...</h3>
				<p>
					If you want to dive deeper still into AI, we offer a wide range of additional activities. Join our Book Club for insightful discussions on the latest reads, attend
					presentations by professors and industry experts, and put your skills to the test in our competitions and Hackathons, with cash prizes.
				</p>
			</div>
		</div>
	</div>

	<div class="events-link-button-wrapper">
		<a href="/events">Learn more <ArrowRight /></a>
	</div>
</section>
<section class="foundational-track" bind:this={foundational_track_element} style="--scroll-progress:{foundational_track_element_scroll_progress}">
	<div class="wrapper">
		<div class="wrapper-background" style="--scroll-progress:{foundational_track_element_scroll_progress}"></div>
		<div class="content">
			<div class="heading">
				<Blocks />
				<h2>Foundational Track</h2>
				<hr />
			</div>
			<p>Start on the path to becoming an AI software developer.</p>

			<div class="parallax" style="--scroll-progress:{foundational_track_element_scroll_progress}">
				<div class="media-wrapper">
					<img
						src="/20230927_Bootcamp_0002.jpg"
						srcset={optimize("/20230927_Bootcamp_0002.jpg")}
						alt="Founding Executive Board member Srikar Pasumarthy giving a presentation for our Computer Vision Workshop"
					/>
				</div>
				<div class="media-wrapper">
					<img
						src="/20231129_Symposium_0009.webp"
						srcset={optimize("/20231129_Symposium_0009.webp")}
						alt="Code from student presentation during our Workshop finale Project Symposium"
					/>
				</div>
				<div class="media-wrapper">
					<img src="/20230927_Bootcamp_0005.webp" srcset={optimize("/20230927_Bootcamp_0005.webp")} alt="Foundational Track members in attendance of a lesson" />
				</div>
				<div class="media-wrapper">
					<img
						src="/20231024_GuestSpeaker_0051.webp"
						srcset={optimize("/20231024_GuestSpeaker_0051.webp")}
						alt="A slide from a guest speaker presentation on beginner concepts of machine learning"
					/>
				</div>
				<a href="/join">Get Started</a>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	section {
		@apply mb-6 lg:mb-14 2xl:mb-16;
	}
	.hero {
		@apply px-2 sm:px-4 md:px-14 xl:px-48;

		.heading {
			@apply px-4;
		}

		h1 {
			@apply mt-8;
			@apply pb-4;

			@apply text-6xl md:text-8xl lg:text-[120px] xl:text-[180px];
		}

		h2 {
			@apply md:text-lg lg:text-xl xl:text-[30px];
		}

		.body {
			@apply bg-black/40;

			@apply xl:w-[865px];
			@apply p-6 md:p-8 xl:p-8;
			@apply mt-8 md:mt-12 xl:mt-16;

			@apply xl:ml-auto;
			@apply md:text-lg lg:text-xl xl:text-2xl;
			p {
				line-height: 1.5;
				text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
			}

			strong span {
				@apply font-bold;
			}
		}
	}

	.cta {
		@apply flex;
		position: relative;
		z-index: 1;

		@apply flex-col sm:flex-row;

		.wrapper {
			width: 100%;

			background: none;
			z-index: -2;
		}

		.content {
			@apply flex flex-col items-center;
			position: relative;

			@apply px-14 py-6 sm:p-8 md:py-12 lg:py-16 xl:py-20 2xl:p-20;

			@apply h-full;
			/* @apply sm:min-h-[400px] lg:min-h-[500px]; */
			@media all and (min-width: 1280px) {
				width: min(50vw, 960px);
				min-height: 800px;
			}

			&:first-child {
				@apply xl:ml-auto;
			}

			h2 {
				font-weight: 700;

				text-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);

				@apply mb-3 md:mb-6 xl:mb-10 2xl:mb-14;
				@apply text-2xl md:text-3xl lg:text-[40px] xl:text-5xl 2xl:text-6xl;
			}

			p {
				font-weight: 300;
				line-height: 1.5;
				text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

				@apply sm:text-lg md:text-xl lg:text-2xl xl:text-[28px];
				@apply mb-4 md:mb-6;
			}

			.cta-button {
				@apply mt-auto;

				@apply flex rounded-xl;

				@apply p-3 md:p-4 lg:p-5;

				font-family: "Noto Sans";
				font-weight: bold;

				@apply md:text-2xl lg:text-4xl xl:text-[55px];

				span {
					font-weight: inherit;
				}

				span:after {
					content: "";
					display: block;
					height: 2px;
					padding-bottom: 2px;
					@apply bg-haze-offwhite/90;
				}
			}

			.deadline {
				font-family: "Noto Sans";
				@apply font-medium italic;
				color: #faf7f7;

				position: absolute;
				text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

				@apply text-[10px] md:text-sm lg:text-lg xl:text-xl;
				@apply bottom-2 sm:bottom-4 md:bottom-5 lg:bottom-7 xl:bottom-10;
			}
		}
		.backdrop-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -2;

			opacity: 0.6;

			height: 100%;
			width: 100%;
			overflow: hidden;

			img {
				height: 100%;
				width: 100%;
				object-fit: cover;
				object-position: center top;
			}
		}
	}

	.events {
		.heading {
			width: fit-content;
			@apply mx-auto;

			h2 {
				font-weight: 700;

				@apply flex items-center px-2;

				@apply text-3xl lg:text-4xl xl:text-6xl;

				:global(svg) {
					@apply text-haze-offwhite;

					@apply mr-1 xl:mr-2;
					@apply square-8 lg:square-10 xl:square-12;
				}
			}

			hr {
				@apply mt-1 lg:mt-1.5 xl:mt-2;
			}
		}

		.event-offerings {
			@apply flex w-full;

			@apply flex-col;
			@media all and (min-width: 660px) {
				@apply flex-row;
			}

			@apply mt-6 md:mt-8 xl:mt-12;

			.event-offering,
			.wrapper {
				flex: 1;
				z-index: -2;
			}

			.event-offering {
				max-width: 660px;
				@apply relative;

				@apply p-4 lg:p-6 xl:p-8;
			}

			h3 {
				font-weight: 700;

				@apply text-center;

				@apply text-2xl lg:text-4xl xl:text-[45px];
				@apply mb-3 lg:mb-8 xl:mb-14;
			}

			p {
				font-weight: 300;

				@apply 2xl:px-6;
				@apply text-lg xl:text-[28px];
				line-height: 1.7;
			}
		}

		.backdrop-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -2;

			opacity: 0.15;

			height: 100%;
			width: 100%;
			overflow: hidden;

			img {
				height: 100%;
				width: 100%;
				object-fit: cover;
				object-position: center top;
			}
		}

		.events-link-button-wrapper {
			@apply mx-auto mt-6;

			width: fit-content;

			a {
				@apply flex items-center;

				font-family: "Noto Sans";
				font-weight: medium;
				text-decoration-line: underline;
				text-underline-offset: 5px;

				@apply decoration-1 lg:decoration-2;

				@apply rounded-xl border-2 border-solid border-haze-offwhite/90;

				@apply text-xl lg:text-3xl xl:text-[40px];
				@apply px-2 py-3 xl:px-4 xl:py-5;

				:global(svg) {
					stroke-width: 1.5px;

					@apply ml-1 xl:ml-2;
					@apply square-6 lg:square-8;
				}
			}
		}
	}

	.foundational-track {
		/* @apply xl:mt-80; */

		.wrapper {
			@apply relative;

			@apply xl:mx-14;
			@apply py-6 lg:px-10 lg:py-12 xl:px-12 xl:py-14;

			.wrapper-background {
				position: absolute;
				background: linear-gradient(145deg, rgba(1, 34, 40, 1) 0%, rgba(2, 49, 69, 1) 100%);
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				z-index: -1;

				@apply lg:rounded-[30px];

				--animation-progress: min(max(0, calc((var(--scroll-progress, 1) + 0.2) / 0.5)), 1);
				--horizontal-offset: calc((1 - var(--animation-progress)) * 0.6);
				--vertical-offset: calc((1 - var(--animation-progress)) * 0.9);

				@media all and (min-width: 1024px) {
					transform: scale(calc(var(--horizontal-offset) + var(--animation-progress)), calc(var(--vertical-offset) + var(--animation-progress)));
				}
			}
		}

		.content {
			@apply mx-auto flex flex-col;

			max-width: 1400px;

			.heading {
				@apply mx-auto flex flex-col items-center;
				width: fit-content;

				:global(svg) {
					@apply square-12 lg:square-14 xl:square-16;
				}

				h2 {
					@apply font-bold;

					@apply text-3xl lg:text-4xl xl:text-[40px];
					@apply mt-2 xl:mt-4;
				}

				hr {
					width: 105%;
					@apply border border-dasyphyllous-green/60;

					@apply mt-2 lg:mt-3 xl:mt-4;
				}
			}

			p {
				font-weight: 300;
				@apply max-w-[80%] lg:max-w-[70%];
				@apply mx-auto;
				@apply text-haze-offwhite/80;

				@apply mt-3 xl:mt-5;
				@apply text-sm lg:text-lg xl:text-xl;
			}

			.parallax {
				position: relative;

				width: 90%;
				@apply mx-auto;

				@apply h-80 md:h-[400px] lg:h-[600px] xl:h-[750px];

				--animation-progress: min(1, max(0, calc((var(--scroll-progress, 0)) * 3)));
				transform: translateY(calc(var(--animation-progress) * 20%));

				.media-wrapper {
					box-shadow: 0 2px 10px 10px rgba(0, 0, 0, 0.25);
				}

				.media-wrapper {
					position: absolute;

					--perspective: 20;
					--translate-ratio: calc(var(--perspective) / (var(--perspective) - var(--translate-z)) - 1);

					transform: translateY(calc((25% + 50vh) * var(--translate-ratio) - (100% + 100vh) * var(--translate-ratio) * var(--scroll-progress, 0.5)));
					will-change: transform;

					overflow: hidden;

					&:first-child {
						--translate-z: 7;

						@apply h-80 md:h-96 xl:h-[550px];
						@apply md:left-[5%];
						@apply top-[-25%] xl:top-[-20%];
					}
					&:nth-child(2) {
						--translate-z: 6;
						border-radius: 5px;

						@apply h-40 md:h-64 xl:h-[350px];
						@apply right-0 md:right-[7%] xl:right-[7%];
						@apply top-[10%] md:top-[-10%] xl:top-[-5%];
					}
					&:nth-child(3) {
						--translate-z: 3;

						@apply h-40 md:h-72 lg:h-80 xl:h-[450px];
						@apply right-[5%] md:right-[10%] lg:right-[18%] xl:right-[13%];
						@apply top-[20%] md:top-[-5%] xl:top-[5%];
					}
					&:nth-child(4) {
						--translate-z: 5;
						bottom: 25%;
						right: 0;
						border-radius: 5px;

						@apply hidden md:block;
						@apply md:h-40 xl:h-[220px];
					}

					img {
						width: auto;
						height: 100%;
					}
				}

				a {
					@apply absolute left-1/2 rounded-xl bg-gradient-to-br from-base-800 to-base-600;
					--translate-z: 8;
					--perspective: 20;
					--translate-ratio: calc(var(--perspective) / (var(--perspective) - var(--translate-z)) - 1);

					transform: translate(-50%, calc((50% + 50vh) * var(--translate-ratio) - (100% + 100vh) * var(--translate-ratio) * var(--scroll-progress, 0.5)));
					will-change: transform;

					font-family: "Noto Sans";
					font-weight: 700;

					box-shadow: 0 0px 20px 10px rgba(0, 0, 0, 0.5);
					text-shadow:
						-5px -5px 5px rgba(0, 0, 0, 0.25),
						5px -5px 5px rgba(0, 0, 0, 0.25),
						5px 5px 5px rgba(0, 0, 0, 0.25),
						-5px 5px 5px rgba(0, 0, 0, 0.25);

					@apply text-xl md:text-3xl lg:text-5xl xl:text-6xl;
					@apply px-3 py-4 md:px-5 md:py-7 xl:px-6 xl:py-8;
					bottom: 40%;
				}
			}
		}
	}
</style>
