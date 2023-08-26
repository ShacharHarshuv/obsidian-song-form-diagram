const colors = [
	"#EF4444",
	"#0EA5E9",
	"#4ADE80",
	"#F59E0B",
	"#6366F1",
	"#D946EF",
	"#FACC15",
	"#EC4899",
];

const namedSectionsColors = new Map<string, number>();
let index = 0;

export function getSectionColor(name?: string | null) {
	if (!name) {
		return colors[index++ % colors.length];
	}

	if (!namedSectionsColors.has(name)) {
		namedSectionsColors.set(name, index++);
	}

	return colors[namedSectionsColors.get(name)! % colors.length];
}

export function resetSectionColors() {
	namedSectionsColors.clear();
	index = 0;
}
