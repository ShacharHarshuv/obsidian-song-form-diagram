import * as React from "react";
import { MultiSystemSectionPlan } from "./planDiagram";
import { Segment } from "./Segment";

export function MultiSystemSection(data: MultiSystemSectionPlan) {
	return (
		<div className="mb-2 mt-2">
			{data.label && (
				<div className="mb-2 text-lg font-bold text-red-400">
					{data.label}
				</div>
			)}
			<div className="-m-2 flex flex-col gap-4 rounded-xl bg-red-400 p-2">
				{data.segments.map((segment, i) => (
					<Segment key={i} {...segment} />
				))}
			</div>
		</div>
	);
}
