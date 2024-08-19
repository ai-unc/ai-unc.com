import type { Actions, PageServerLoad } from "./$types";

import { message, setError, superValidate } from "sveltekit-superforms";
import { fail, redirect } from "@sveltejs/kit";

import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./formSchema";

import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, NODEMAILER_APP_PASSWORD } from "$env/static/private";

import Stripe from "stripe";
import { dev } from "$app/environment";

import nodemailer from "nodemailer";
import { CURRENT_YEAR, JOIN_DEADLINE } from "$lib/utils/CONSTANTS";
import { getYearString } from "$lib/utils/years";

import { QRCodeCanvas } from "styled-qr-code-node";

export const prerender = false;

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions: Actions = {
	join: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (new Date().toISOString() > JOIN_DEADLINE) return setError(form, "", "The deadline has passed", { status: 401 });

		const { email, first_name, last_name, is_beginner_track } = form.data;

		// Add user to database
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

		const { data, error } = await supabase
			.from("members")
			.insert({ email, first_name, last_name, track: is_beginner_track ? "beginner" : "technical", membership_year: getYearString(CURRENT_YEAR) })
			.select("id");

		// TODO: Error message handling
		if (error) {
			console.error(`(SUPABASE) Issue inserting member record: ${error.message}`);
			if (error.code === "23505") return setError(form, "email", `${email} has already been used to signup for the ${getYearString(CURRENT_YEAR)} Academic Year`);
			return fail(500, { form });
		}

		// Send email
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: "aiclub.unc@gmail.com",
				pass: NODEMAILER_APP_PASSWORD,
			},
		});

		const qrCode = new QRCodeCanvas({
			width: 400,
			height: 400,
			data: data[0]!.id,
			cornersSquareOptions: {
				type: "extra-rounded",
				color: "#4b9cd3",
			},
			cornersDotOptions: {
				type: "dot",
				color: "#4b9cd3",
			},
			backgroundOptions: {
				gradient: {
					type: "linear",
					rotation: 0.7,
					colorStops: [
						{ color: "#f7f9fa", offset: 0 },
						{ color: "#ebeced", offset: 0.5 },
					],
				},
			},
			dotsOptions: {
				gradient: {
					type: "linear",
					rotation: 0.5,
					colorStops: [
						{ color: "#7bafd4", offset: 0 },
						{ color: "#4f87b3", offset: 1 },
					],
				},
			},
		});

		const qrCodeURI = await qrCode.toDataUrl("image/png", { quality: 1 });

		const primary_track_offerings = `<strong>Primary Track Membership</strong><br/>
		✅ Able to attend our Private <a href="https://www.ai-unc.com/events">Events</a> (such as our Book Club)<br/>
		✅ Work on a yearlong AI project with other club members<br/>
		✅ Collaborate with professors and partner with labs/research teams<br/>
		✅ Develop and pursue your own idea for an application of AI<br/>
		✅ Receive ongoing logistical and technical support from our experienced Technical Chairs<br/>
		✅ Opportunity to apply for project funding from AI@UNC<br/>
		✅ <strong>Opportunity to present at AI@UNC I/O</strong>`;
		const foundational_track_offerings = `<strong>Foundational Track Membership</strong><br/>
		✅ Able to attend our Private <a href="https://www.ai-unc.com/events">Events</a> (such as our Book Club)<br/>
		✅ Learn to use AI tools from experts in our Foundational Workshops<br/>
		✅ Receive guidance and training to become confident in your technical abilities`;

		await new Promise((resolve, reject) => {
			transporter.verify(async (error, success) => {
				if (error) {
					console.error(`(NODEMAILER) Issue verifying transporter: ${error}`);
					reject(error);
				} else {
					resolve(success);
				}
			});
		});
		await new Promise((resolve, reject) => {
			transporter.sendMail(
				{
					from: "aiclub.unc@gmail.com",
					to: email,
					subject: `Welcome to AI@UNC`,
					html: `Hey ${first_name} ${last_name},
				<br/>
				Welcome to AI@UNC!
				<br/><br/>
				We're excited to have you join us as a ${is_beginner_track ? "Foundational" : "Primary"} Track Member for the ${getYearString(CURRENT_YEAR)} Academic Year.
				<br/><br/>
				In this email, you will find your Unique Member ID, along with your Membership Badge & QR Code. You are required to scan in to our events using your badge to record attendance. If you have not already, you can use your ID on our <a href="https://www.ai-unc.com/join/pay?id=${data[0]!.id}">website to pay your dues</a>
				<br/><br/>
				Your membership with us this year grants you access to the following opportunities:
				<br/>
				${is_beginner_track ? foundational_track_offerings : primary_track_offerings}
				<br/><br/>
				Your Unique Member ID is: <strong>${data[0]!.id}</strong>
				<br/>
				<strong>Do NOT share this ID</strong>
				<br/>
				<img src=${qrCodeURI}>
				<br/><br/>
				In order to continue your journey, AI@UNC club dues must be paid prior to October 14th through our <a href="https://www.ai-unc.com/join/pay?id=${data[0]!.id}">website</a>.
				<br/><br/>
				At the end of the academic year, provided you have paid your dues and you are in good standing, your name will be displayed <a href="https://www.ai-unc.com/members">here</a> on our website, which is the official membership roster of the club.
				At the end of the academic year you will be recommended as an active member to all companies we have contact with, such as Fidelity and Deloitte. Your attendance, projects, and whether you have presented at AI@UNC I/O will be communicated to them.
				<br/><br/>
				We look forward to an incredible year of AI exploration with you!
				<br/><br/>
				Sincerely,
				<br/><br/>
				Hanqi Xiao
				<br/>
				President, AI@UNC
				<br/><br/>
				Thomas Bland
				<br/>
				Vice President, AI@UNC
				`,
					attachDataUrls: true,
				},
				(err, info) => {
					if (err) {
						console.error(err);
						reject(err);
					} else {
						resolve(info);
					}
				},
			);
		});

		return message(form, { success: true, id: data[0]!.id });
	},
};
