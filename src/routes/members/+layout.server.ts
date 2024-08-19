import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { createServerClient } from "@supabase/ssr";
import type { LayoutServerLoad } from "./$types";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { CURRENT_YEAR, FIRST_YEAR } from "$lib/utils/CONSTANTS";
import { error as kitError, redirect } from "@sveltejs/kit";
import { getYearString } from "$lib/utils/years";

export const load: LayoutServerLoad = async ({ fetch, params, cookies }) => {
	if (params.year && params.year.match("^[0-9]{4}-[0-9]{2}$") === null) {
		if (params.year.match("^[0-9]{4}$")) {
			params.year += "-";
		} else {
			throw kitError(404);
		}
	}

	let fall_year;
	if (params.year) {
		fall_year = parseInt(params.year.split("-")[0]!);
		if (fall_year === CURRENT_YEAR) throw redirect(301, "/members");
		if (fall_year < FIRST_YEAR || fall_year > CURRENT_YEAR) throw kitError(404);
	}

	const YEAR_STRING = getYearString(fall_year ? fall_year : CURRENT_YEAR);
	if (params.year && params.year !== YEAR_STRING) {
		throw redirect(301, `/members/${YEAR_STRING}`);
	}

	const supabase = createServerClient<Database.Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: {
			fetch,
		},
		cookies: {
			getAll() {
				return cookies.getAll();
			},
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: "/" });
				});
			},
		},
	});

	async function getOfficers() {
		const { data, error } = await supabase.from("officers").select("name, position").eq("year", YEAR_STRING);
		if (error) throw kitError(500, { message: error.message });
		return data;
	}
	async function getPrimaryTrackMembers() {
		const { data, error } = await supabase
			.from("members")
			.select("first_name, last_name")
			.eq("membership_year", YEAR_STRING)
			.eq("track", "technical")
			.not("dues_paid_at", "is", null)
			.eq("met_attendance_requirements", true)
			.order("last_name");
		if (error) throw kitError(500, { message: error.message });
		return data;
	}
	async function getFoundationalTrackMembers() {
		const { data, error } = await supabase
			.from("members")
			.select("first_name, last_name")
			.eq("membership_year", YEAR_STRING)
			.eq("track", "beginner")
			.not("dues_paid_at", "is", null)
			.eq("met_attendance_requirements", true)
			.order("last_name");
		if (error) throw kitError(500, { message: error.message });
		return data;
	}

	return {
		year_string: YEAR_STRING,
		officers: await getOfficers(),
		primary_track_members: await getPrimaryTrackMembers(),
		foundational_track_members: await getFoundationalTrackMembers(),
	};
};
