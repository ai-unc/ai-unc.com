import type { LayoutServerLoad } from "./$types";
import { GOOGLE_API_KEY, SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { createBrowserClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";

import { error as kitError } from "@sveltejs/kit";

export const prerender = false;
export const load: LayoutServerLoad = async ({ fetch }) => {
	const CURRENT_DATE_ISO = new Date().toISOString();
	async function getEvents(): Promise<Array<CalendarEvent>> {
		const response = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/aiclub.unc@gmail.com/events?key=${GOOGLE_API_KEY}&showDeleted=false&singleEvents=true&timeMin=${CURRENT_DATE_ISO}&orderBy=startTime`,
		);
		const json: { items: Array<CalendarEvent> } = await response.json();
		return json.items;
	}
	async function getPastEvents(): Promise<Array<CalendarEvent>> {
		const response = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/aiclub.unc@gmail.com/events?key=${GOOGLE_API_KEY}&showDeleted=false&singleEvents=true&timeMax=${CURRENT_DATE_ISO}&orderBy=startTime`,
		);
		const json: { items: Array<CalendarEvent> } = await response.json();
		return json.items.reverse();
	}

	const supabase = createBrowserClient<Database.Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: {
			fetch,
		},
	});

	const { data, error } = await supabase.from("events_data").select();

	if (error) {
		kitError(500, { message: error.message });
	}

	return {
		events_data: data,
		events: getEvents(),
		// past_events: getPastEvents(),
		// events: [],
		past_events: getPastEvents(),
	};
};
