import * as React from "react";
import { InlineSectionPlan } from "./planDiagram";

export function InlineSection(data: InlineSectionPlan) {
	return (
		<div
			className="p-1"
			style={{
				gridColumnStart: data.start + 1,
				gridColumnEnd: data.end + 1,
			}}
		>
			<div>{data.label}</div>
			<div className="h-4 border-l border-r border-t"></div>
		</div>
	);
}
