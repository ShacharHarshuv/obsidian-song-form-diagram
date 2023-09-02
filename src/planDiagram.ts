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
	level: number; // 0 means closest to the system, 1 means there is a section between the system and the inline section, etc.
};

export type MultiSystemSectionPlan = {
	type: "multi-system-section";
	segments: SegmentPlan[];
	paddingLevel: number;
	label: string | null;
};

export type DiagramPlan = {
	// the nesting level is used to determine how much padding is needed horizontally for the systems
	// It corresponds to the deepest level of sections nesting
	paddingLevel: number;
	segments: SegmentPlan[];
};

export function planDiagram(diagramData: DiagramData): DiagramPlan {
	const barsPerLine = 8; // todo: in the future we can make it configurable
	let barIndex = 0;

	function planSegments(segments: DiagramData): {
		segments: SegmentPlan[];
		paddingLevel: number;
	} {
		const plannedSegments: DiagramPlan["segments"] = [];
		let currentSystemBars: BarPlan[] = [];
		let currentSystemInlineSegments: InlineSectionPlan[] = [];
		let highestNestedMultiSystemSection = -1; // -1 means we didn't find any section

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

		function processSegments(segments: Segment[]): {
			// 0 if it has no sections, 1 if it has one section, 2 it  has one section with a section inside, etc.
			deepestNestingLevel: number;
		} {
			let deepestNestingLevel = 0;
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

					const isMultiSystemSection =
						currentSystemBars.length + sectionLength >
							barsPerLine || sectionLength >= barsPerLine;

					if (isMultiSystemSection) {
						const plannedSection = planSegments(segment.segments);

						if (currentSystemBars.length > 0) {
							pushSystem();
						}

						highestNestedMultiSystemSection = Math.max(
							highestNestedMultiSystemSection,
							plannedSection.paddingLevel,
						);

						plannedSegments.push({
							type: "multi-system-section",
							...plannedSection,
							label: segment.label,
						});

						deepestNestingLevel = Math.max(
							deepestNestingLevel,
							plannedSection.paddingLevel + 1,
						);
					} else {
						const inlineSection: InlineSectionPlan = {
							type: "inline-section",
							label: segment.label,
							start: currentSystemBars.length,
							end: currentSystemBars.length + sectionLength,
							level: 0,
						};
						currentSystemInlineSegments.push(inlineSection);
						const {
							deepestNestingLevel:
								deepestNestingLevelForInnerSegments,
						} = processSegments(segment.segments);
						inlineSection.level +=
							deepestNestingLevelForInnerSegments;
						deepestNestingLevel = Math.max(
							deepestNestingLevel,
							inlineSection.level + 1,
						);
					}
				}
			}

			return {
				deepestNestingLevel,
			};
		}

		processSegments(segments);

		if (currentSystemBars.length > 0) {
			pushSystem();
		}

		plannedSegments.forEach((segment) => {
			segment.type === "multi-system-section" &&
				(segment.paddingLevel = highestNestedMultiSystemSection);
		});

		return {
			segments: plannedSegments,
			paddingLevel: highestNestedMultiSystemSection + 1,
		};
	}

	return {
		...planSegments(diagramData),
	};
}
