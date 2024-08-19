import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { preprocessMeltUI, sequence } from "@melt-ui/pp";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),

	kit: {
		prerender: {
			handleHttpError: (err) => {
				if (err.path === "/_vercel/image") return;
				throw new Error(err.message);
			},
		},
		adapter: adapter({
			images: {
				sizes: [640, 828, 1200, 1920, 3840],
				formats: ["image/avif", "image/webp"],
				minimumCacheTTL: 300,
				domains: ["ai-unc.com"],
			},
		}),
	},
};

export default config;
