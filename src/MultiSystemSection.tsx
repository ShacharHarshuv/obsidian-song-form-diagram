import * as React from "react";
import { MultiSystemSectionPlan } from "./planDiagram";
import { Segment } from "./Segment";

export function MultiSystemSection(data: MultiSystemSectionPlan) {
	return (
		<div className="-m-2 mb-2 flex flex-col gap-4 rounded-xl bg-red-400 p-2">
			{data.segments.map((segment, i) => (
				<Segment key={i} {...segment} />
			))}
		</div>
	);
}
