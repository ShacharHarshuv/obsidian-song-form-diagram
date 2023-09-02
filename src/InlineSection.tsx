import * as React from "react";
import { InlineSectionPlan } from "./planDiagram";

export function InlineSection(
	data: InlineSectionPlan & {
		style?: React.CSSProperties;
	},
) {
	return (
		<div
			className="p-1"
			style={{
				...(data.style ?? {}),
				gridColumnStart: data.start + 1,
				gridColumnEnd: data.end + 1,
			}}
		>
			<div>{data.label}</div>
			<div className="h-4 rounded-t-sm border-l border-r border-t"></div>
		</div>
	);
}
