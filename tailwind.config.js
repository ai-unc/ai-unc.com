import plugin from "tailwindcss/plugin";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.svelte"],
	theme: {
		extend: {
			colors: {
				base: {
					DEFAULT: "#022840",
					600: "#022033",
					800: "#011826",
				},
				dark: {
					DEFAULT: "#01242e",
					600: "#011e26",
					900: "#01141a",
				},
				"web-carolina-blue": "#4b9cd3",
				"carolina-blue": "#7bafd4",
				"haze-offwhite": "#f7f9fa",
				"kuretake-manga-black": "#00141a",
				"american-penny": "#401802",
				"brown-sugar": "#d37b4b",
				"dasyphyllous-green": "#07df3d",
				"medium-turquoise": "#4bd3c6",
				"campus-sandstone": "#f4e8dd",
				"azalea-pink": "#ef426f",
				"sunburst-yellow": "#ffd100",
				"tile-teal": "#00a5ad",
			},
		},
	},
	plugins: [
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value,
					}),
				},
				{ values: theme("spacing") },
			);
		}),
	],
};
