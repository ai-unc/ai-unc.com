import type { PrerenderEntryGenerator } from "@sveltejs/kit";
import { getYearSlugs } from "$lib/utils/years";

export const entries: PrerenderEntryGenerator = () => {
	return getYearSlugs().map((s) => {
		return { year: s };
	});
};
