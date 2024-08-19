import { createBrowserClient } from "@supabase/ssr";
import type { LayoutServerLoad } from "./$types";

import { error as kitError } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";

export const load: LayoutServerLoad = async ({ fetch }) => {
	const supabase = createBrowserClient<Database.Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: {
			fetch,
		},
	});

	const { data, error } = await supabase.from("projects").select().order("created_at", { ascending: false });

	if (error) throw kitError(500, { message: error.message });

	return {
		projects: data,
	};
};
