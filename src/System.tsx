import * as React from "react";
import { Bar } from "./Bar";
import { SystemPlan } from "./planDiagram";

export function System(data: SystemPlan) {
	return (
		<div className="grid h-8 grid-cols-8 rounded-md">
			{data.bars.map((bar, i) => {
				return <Bar key={i} {...bar} />;
			})}
		</div>
	);
}
