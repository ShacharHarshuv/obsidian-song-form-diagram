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
	label: string | null;
};

export type DiagramPlan = {
	segments: SegmentPlan[];
};

export function planDiagram(diagramData: DiagramData): DiagramPlan {
	const barsPerLine = 8; // todo: in the future we can make it configurable

	function planSegments(
		segments: DiagramData,
	): (SystemPlan | MultiSystemSectionPlan)[] {
		const plannedSegments: DiagramPlan["segments"] = [];

		let currentSystemBars: BarPlan[] = [];

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

				plannedSegments.push({
					type: "multi-system-section",
					segments: planSegments(segmentData.segments),
					label: segmentData.label,
				});
			}
		}

		if (currentSystemBars.length > 0) {
			pushSystem();
		}

		return plannedSegments;
	}

	return {
		segments: planSegments(diagramData),
	};
}
