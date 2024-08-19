export function buildProjectSlug(title: string, id: string): string {
	return `${title.replaceAll(/[^A-Za-z0-9 ]/g, "").replaceAll(" ", "-")}-${id}`;
}
