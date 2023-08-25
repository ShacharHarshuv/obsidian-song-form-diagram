const namedSections = new Map<string, number>();
let index = 0;

export function getSectionColor(name: string) {
	if (!namedSections.has(name)) {
		namedSections.set(name, index++);
	}

	return namedSections.get(name)!;
}
