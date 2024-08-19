export function replaceDateCodeWithText(code: string): string {
	if (code.startsWith("Fa")) {
		return code.replace("Fa", "Fall ");
	} else if (code.startsWith("Sp")) {
		return code.replace("Sp", "Spring ");
	} else if (code.startsWith("Su")) {
		return code.replace("Su", "Summer ");
	}
	return code;
}
