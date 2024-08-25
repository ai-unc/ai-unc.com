import type { PrerenderEntryGenerator } from "@sveltejs/kit";
import { getYearSlugs } from "$lib/utils/years";

export const entries: PrerenderEntryGenerator = () => {
	return getYearSlugs(CURRENT_YEAR).map((s) => {
		return { year: s };
	});
};

import type { PageServerLoad } from "./$types";

let CURRENT_YEAR: number;

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	CURRENT_YEAR = data.CURRENT_YEAR;
};
