import * as React from "react";
import { Bar } from "./Bar";
import { InlineSection } from "./InlineSection";
import { SystemPlan } from "./planDiagram";

export function System(data: SystemPlan) {
	return (
		<div className="grid grid-cols-8 rounded-md">
			{data.inlineSections.map((inlineSection, i) => {
				return <InlineSection key={i} {...inlineSection} />;
			})}
			{data.bars.map((bar, i) => {
				return <Bar style={{ gridRowStart: 2 }} key={i} {...bar} />;
			})}
		</div>
	);
}
