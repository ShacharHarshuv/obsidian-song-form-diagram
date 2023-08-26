import * as React from "react";
import { MultiSystemSection } from "./MultiSystemSection";
import { SegmentPlan } from "./planDiagram";
import { System } from "./System";

export function Segment(segment: SegmentPlan) {
	switch (segment.type) {
		case "system":
			return <System {...segment} />;
		case "multi-system-section":
			return <MultiSystemSection {...segment} />;
		// segment.type satisfies never;
	}
}
