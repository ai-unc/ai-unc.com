import { CURRENT_YEAR, FIRST_YEAR } from "./CONSTANTS";

export function getYearString(year: number): string {
	return `${year}-${(year + 1).toString().substring(2)}`;
}

export function getYearSlugs() {
	const slugs = [];
	for (let year = FIRST_YEAR; year <= CURRENT_YEAR; year++) {
		const year_string = getYearString(year);
		slugs.push(year_string, year_string.split("-")[0]!);
	}
	return slugs;
}
