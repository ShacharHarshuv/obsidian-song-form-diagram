import { DiagramData, Section, Segment } from "./DiagramData";

export type BarPlan = {
	index: number;
};

export type SystemPlan = {
	type: "system";
	fullRowLength: number;
	bars: BarPlan[];
	inlineSections: InlineSectionPlan[];
};

export type SegmentPlan = SystemPlan | MultiSystemSectionPlan;

export type InlineSectionPlan = {
	type: "inline-section";
	label: string | null;
	start: number;
	end: number;
};

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
	let barIndex = 0;

	function planSegments(segments: DiagramData): {
		segments: SegmentPlan[];
		nestingLevel: number;
	} {
		const plannedSegments: DiagramPlan["segments"] = [];
		let currentSystemBars: BarPlan[] = [];
		let currentSystemInlineSegments: InlineSectionPlan[] = [];
		let highestNestedSection = -1; // -1 means we didn't find any section

		function pushSystem() {
			plannedSegments.push({
				type: "system",
				fullRowLength: barsPerLine,
				bars: currentSystemBars,
				inlineSections: currentSystemInlineSegments,
			});
			currentSystemBars = [];
			currentSystemInlineSegments = [];
		}

		function countBars(section: Section) {
			return section.segments.reduce((acc, segment): number => {
				if (segment.type === "bar") {
					return acc + 1;
				}
				return acc + countBars(segment);
			}, 0);
		}

		function processSegments(segments: Segment[]) {
			for (const segment of segments) {
				if (currentSystemBars.length >= barsPerLine) {
					pushSystem();
				}

				if (segment.type === "bar") {
					if (currentSystemBars.length < barsPerLine) {
						currentSystemBars.push({
							index: barIndex++,
						});
					}
				}

				if (segment.type === "section") {
					const sectionLength = countBars(segment);

					if (
						currentSystemBars.length + sectionLength >
							barsPerLine ||
						sectionLength >= barsPerLine
					) {
						const plannedSection = planSegments(segment.segments);

						if (currentSystemBars.length > 0) {
							pushSystem();
						}

						highestNestedSection = Math.max(
							highestNestedSection,
							plannedSection.nestingLevel,
						);

						plannedSegments.push({
							type: "multi-system-section",
							...plannedSection,
							label: segment.label,
						});
					} else {
						currentSystemInlineSegments.push({
							type: "inline-section",
							label: segment.label,
							start: currentSystemBars.length,
							end: currentSystemBars.length + sectionLength,
						});
						processSegments(segment.segments);
					}
				}
			}
		}

		processSegments(segments);

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
