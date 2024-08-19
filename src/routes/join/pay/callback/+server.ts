import { STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import { error as kitError, redirect } from "@sveltejs/kit";
import Stripe from "stripe";

export const GET = async ({ url, cookies }) => {
	const session_id = url.searchParams.get("session_id");
	const id = url.searchParams.get("id");

	if (session_id == null || id == null) {
		throw kitError(400);
	}

	const stripe = new Stripe(STRIPE_SECRET_KEY);
	const paid = (await stripe.checkout.sessions.retrieve(session_id)).payment_status === "paid";

	if (paid === false) throw kitError(400, { message: "Invalid session" });

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
	const { error } = await supabase.from("members").update({ dues_paid_at: new Date().toISOString() }).eq("id", id);
	if (error) throw kitError(500, { message: "Oops! Unexpected error..." });
	return redirect(302, "/join/pay/success");
};
