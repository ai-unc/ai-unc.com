import type { Actions, PageServerLoad } from "./$types";

import { error as kitError, fail, redirect } from "@sveltejs/kit";

import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY } from "$env/static/private";

import Stripe from "stripe";
import { dev } from "$app/environment";

import { CURRENT_YEAR } from "$lib/utils/CONSTANTS";
import { getYearString } from "$lib/utils/years";

export const prerender = false;

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
	const id = url.searchParams.get("id");
	if (id) {
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
		const { data, error } = await supabase.from("members").select().eq("id", id).eq("membership_year", getYearString(CURRENT_YEAR));
		if (error) {
			throw kitError(500, { message: error.message });
		}
		if (data[0] != null) {
			if (data[0].dues_paid_at) {
				return;
			}
			return {
				id: id,
				member_data: data[0],
			};
		}
	}
};

// TODO: Move to superforms
export const actions: Actions = {
	verify: async ({ request, cookies }) => {
		const form_data = await request.formData();
		const id = form_data.get("id");
		if (id) {
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
			const { data, error } = await supabase.from("members").select().eq("id", id).eq("membership_year", getYearString(CURRENT_YEAR));
			if (error) {
				return fail(500, { error: "Oops! There was a problem." });
			}
			if (data[0] == null) {
				return fail(500, { error: "No matching member" });
			}
			if (data[0].dues_paid_at !== null) {
				return fail(500, { error: `You have already paid your dues on ${data[0].dues_paid_at}!` });
			}
			return {
				member_data: data[0],
			};
		}
	},
	pay: async ({ request }) => {
		const form_data = await request.formData();
		const id = form_data.get("id");
		const email = form_data.get("email");
		const track = form_data.get("track");

		if (id == null || email == null || track == null) return fail(500, { error: "Missing fields" });

		const primary_track_price_id = dev ? "price_1PpNVjHVPOTtkojgDS4uhZPu" : "price_1PpO6oHVPOTtkojgQKqDtK3n"; //spellchecker: disable-line
		const foundational_track_price_id = dev ? "price_1PjSzIHVPOTtkojggOe291LX" : "price_1PpO74HVPOTtkojgrmYrAM3O"; //spellchecker: disable-line

		const stripe = new Stripe(STRIPE_SECRET_KEY);
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: track === "beginner" ? foundational_track_price_id : primary_track_price_id,
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${dev ? "http://localhost:5173" : "https://ai-unc.com"}/join/pay/callback?session_id={CHECKOUT_SESSION_ID}&id=${id}`,
			customer_email: email.toString(),
		});
		return redirect(302, session.url!);
	},
};
