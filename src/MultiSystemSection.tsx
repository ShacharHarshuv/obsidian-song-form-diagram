import * as React from "react";
import { getSectionColor } from "./getSectionColor";
import { MultiSystemSectionPlan } from "./planDiagram";
import { Segment } from "./Segment";

export function MultiSystemSection(data: MultiSystemSectionPlan) {
	const color = getSectionColor(data.label);

	return (
		<div className="mb-2 mt-2">
			{data.label && (
				<div className="-mt-3 mb-2 text-lg font-bold" style={{ color }}>
					{data.label}
				</div>
			)}
			<div
				className="-m-2 flex flex-col gap-4 rounded-xl p-2"
				style={{ backgroundColor: color }}
			>
				{data.segments.map((segment, i) => (
					<Segment key={i} {...segment} />
				))}
			</div>
		</div>
	);
}
