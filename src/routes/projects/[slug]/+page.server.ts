import type { PageServerLoad } from "./$types";

import { error as kitError, redirect } from "@sveltejs/kit";
import { buildProjectSlug } from "../buildProjectSlug";

export const prerender = false;

export const load: PageServerLoad = async ({ params, parent }) => {
	if (params.slug.match("^[A-Za-z0-9-]+-[a-z0-9]{12}$") === null && params.slug.match("^[a-z0-9]{12}$") === null) throw kitError(404, { message: "Invalid url" });

	const { projects } = await parent();

	const slug_parts = params.slug.split("-");
	const id = slug_parts[slug_parts.length - 1];

	const matching_project = projects.find((p) => {
		return p.id === id;
	});

	if (matching_project === undefined) throw kitError(404);
	const matching_slug = buildProjectSlug(matching_project.title, matching_project.id);

	if (matching_slug !== params.slug) throw redirect(301, `/projects/${matching_slug}`);

	return {
		project: matching_project,
	};
};
