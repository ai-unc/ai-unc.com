import type { LayoutServerLoad } from "./$types";

import { createClient } from "@vercel/kv";

import { KV_REST_API_URL, KV_REST_API_READ_ONLY_TOKEN } from "$env/static/private";
import { error } from "@sveltejs/kit";

export const load = (async ({ setHeaders }) => {
	const client = createClient({
		url: KV_REST_API_URL,
		token: KV_REST_API_READ_ONLY_TOKEN,
	});
	const CURRENT_YEAR = await client.get<number>("CURRENT_YEAR");
	const JOIN_DEADLINE = await client.get<string>("JOIN_DEADLINE");
	const DUES_DEADLINE = await client.get<string>("DUES_DEADLINE");

	if (!CURRENT_YEAR || !JOIN_DEADLINE || !DUES_DEADLINE) throw error(500);

	setHeaders({
		"Cache-Control": "s-max-age=86400",
	});

	return {
		CURRENT_YEAR,
		JOIN_DEADLINE,
		DUES_DEADLINE,
	};
}) satisfies LayoutServerLoad;
