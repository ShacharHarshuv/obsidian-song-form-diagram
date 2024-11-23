const introColor = "#6B7280";
const chorusColor = "#EF4444";
const bPartColor = "#F59E0B";
const verseColor = "#0EA5E9";
const bridgeColor = "#10B981";

const colors = [
	chorusColor,
	verseColor,
	bridgeColor,
	bPartColor,
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

	if (/\bA\b/.test(name) || name?.toLowerCase().includes("chorus")) {
		return chorusColor;
	}

	if (name?.toLowerCase().includes("intro")) {
		return introColor;
	}

	if (name?.toLowerCase().includes("verse")) {
		return verseColor;
	}

	if (!namedSectionsColors.has(name)) {
		namedSectionsColors.set(name, index++);
	}

	if (/\bB\b/.test(name)) {
		return bPartColor;
	}

	if (
		name?.toLowerCase().includes("bridge") ||
		name?.toLowerCase().includes("c-part") ||
		name?.toLowerCase().includes("c part")
	) {
		return bridgeColor;
	}

	return colors[namedSectionsColors.get(name)! % colors.length];
}

export function resetSectionColors() {
	namedSectionsColors.clear();
	index = 0;
}
