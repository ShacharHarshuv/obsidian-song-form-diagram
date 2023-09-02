import * as React from "react";
import { Bar } from "./Bar";
import { InlineSection } from "./InlineSection";
import { SystemPlan } from "./planDiagram";

export function System(data: SystemPlan) {
	const maxNestedLevel = data.inlineSections.reduce((max, segment) => {
		return Math.max(max, segment.level);
	}, 0);

	return (
		<div className="grid grid-cols-8 rounded-md">
			{data.inlineSections.map((inlineSection, i) => {
				return (
					<InlineSection
						style={{
							gridRowStart:
								maxNestedLevel - inlineSection.level + 1,
						}}
						key={i}
						{...inlineSection}
					/>
				);
			})}
			<div className="contents">
				{data.bars.map((bar, i) => {
					return (
						<Bar
							style={{ gridRowStart: maxNestedLevel + 2 }}
							key={i}
							{...bar}
						/>
					);
				})}
			</div>
		</div>
	);
}
