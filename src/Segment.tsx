import * as React from "react";
import { MultiSystemSection } from "./MultiSystemSection";
import { System } from "./System";
import { SegmentPlan } from "./planDiagram";

export function Segment(
	segment: SegmentPlan & {
		nested: boolean;
	},
) {
	switch (segment.type) {
		case "system":
			return <System {...segment} />;
		case "multi-system-section":
			return <MultiSystemSection {...segment} />;
		// segment.type satisfies never;
	}
}
