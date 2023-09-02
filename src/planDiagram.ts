import { DiagramData, Note, Section, Segment } from "./DiagramData";

export type BarPlan = {
	index: number;
};

export type NotePlan = Note & {
	position: number;
};

export type SystemPlan = {
	type: "system";
	fullRowLength: number;
	bars: BarPlan[];
	inlineSections: InlineSectionPlan[];
	bottomNotes: NotePlan[];
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
		// let currentSystemBars: BarPlan[] = [];
		// let currentSystemInlineSegments: InlineSectionPlan[] = [];
		// let currentSystemNotes: NotePlan[] = [];
		let currentSystem: SystemPlan = {
			type: "system",
			fullRowLength: barsPerLine,
			bars: [],
			inlineSections: [],
			bottomNotes: [],
		};
		let highestNestedMultiSystemSection = -1; // -1 means we didn't find any section

		function pushSystem() {
			plannedSegments.push(currentSystem);
			currentSystem = {
				type: "system",
				fullRowLength: barsPerLine,
				bars: [],
				inlineSections: [],
				bottomNotes: [],
			};
		}

		function countBars(section: Section) {
			return section.segments.reduce((acc, segment): number => {
				if (segment.type === "bar") {
					return acc + 1;
				}
				if (segment.type === "note") {
					return acc;
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
				const { type: segmentType } = segment;

				if (segmentType === "note") {
					currentSystem.bottomNotes.push({
						...segment,
						position:
							currentSystem.bars.length +
							(segment.alignment === "right" ? 1 : 0),
					});
					continue;
				}

				if (currentSystem.bars.length >= barsPerLine) {
					pushSystem();
				}

				if (segmentType === "bar") {
					if (currentSystem.bars.length < barsPerLine) {
						currentSystem.bars.push({
							index: barIndex++,
						});
					}
					continue;
				}

				if (segmentType === "section") {
					const sectionLength = countBars(segment);

					const isMultiSystemSection =
						currentSystem.bars.length + sectionLength >
							barsPerLine || sectionLength >= barsPerLine;

					if (isMultiSystemSection) {
						const plannedSection = planSegments(segment.segments);

						if (currentSystem.bars.length > 0) {
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
							start: currentSystem.bars.length,
							end: currentSystem.bars.length + sectionLength,
							level: 0,
						};
						currentSystem.inlineSections.push(inlineSection);
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
					continue;
				}

				segmentType satisfies never;
			}

			return {
				deepestNestingLevel,
			};
		}

		processSegments(segments);

		if (currentSystem.bars.length > 0) {
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
