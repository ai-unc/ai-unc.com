import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	const { CURRENT_YEAR } = await parent();
	return {
		CURRENT_YEAR,
	};
};
