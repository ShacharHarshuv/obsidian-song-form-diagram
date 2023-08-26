import { DiagramData } from "./DiagramData";

export type BarPlan = {};

export type SystemPlan = {
	type: "system";
	fullRowLength: number;
	bars: BarPlan[];
};

export type SegmentPlan = SystemPlan | MultiSystemSectionPlan;

export type MultiSystemSectionPlan = {
	type: "multi-system-section";
	segments: SegmentPlan[];
	nestingLevel: number;
	label: string | null;
};

export type DiagramPlan = {
	// the nesting level is used to determine how much padding is needed horizontally for the systems
	// It corresponds to the deepest level of sections nesting
	nestingLevel: number;
	segments: SegmentPlan[];
};

export function planDiagram(diagramData: DiagramData): DiagramPlan {
	const barsPerLine = 8; // todo: in the future we can make it configurable

	function planSegments(segments: DiagramData): {
		segments: SegmentPlan[];
		nestingLevel: number;
	} {
		const plannedSegments: DiagramPlan["segments"] = [];
		let currentSystemBars: BarPlan[] = [];
		let highestNestedSection = -1; // -1 means we didn't find any section

		function pushSystem() {
			plannedSegments.push({
				type: "system",
				fullRowLength: barsPerLine,
				bars: currentSystemBars,
			});
			currentSystemBars = [];
		}

		for (const segmentData of segments) {
			if (segmentData.type === "bar") {
				if (currentSystemBars.length >= barsPerLine) {
					pushSystem();
				}

				if (currentSystemBars.length < barsPerLine) {
					currentSystemBars.push({});
				}
			}

			if (segmentData.type === "section") {
				if (currentSystemBars.length > 0) {
					pushSystem();
				}

				const plannedSection = planSegments(segmentData.segments);

				highestNestedSection = Math.max(
					highestNestedSection,
					plannedSection.nestingLevel,
				);

				plannedSegments.push({
					type: "multi-system-section",
					...plannedSection,
					label: segmentData.label,
				});
			}
		}

		if (currentSystemBars.length > 0) {
			pushSystem();
		}

		plannedSegments.forEach((segment) => {
			segment.type === "multi-system-section" &&
				(segment.nestingLevel = highestNestedSection);
		});

		return {
			segments: plannedSegments,
			nestingLevel: highestNestedSection + 1,
		};
	}

	return {
		...planSegments(diagramData),
	};
}
