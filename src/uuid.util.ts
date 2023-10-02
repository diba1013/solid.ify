export function uid(length = 6): string {
	return Math.random()
		.toString(36)
		.slice(2, length + 2);
}
