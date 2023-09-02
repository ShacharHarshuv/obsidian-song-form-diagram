export function fillArray<T extends Record<string, any>>(
	length: number,
	value: T | ((i: number) => T),
): T[] {
	return Array(length)
		.fill(null)
		.map((_, i) => {
			if (typeof value === "function") {
				return (value as (i: number) => T)(i);
			}
			return value;
		});
}
