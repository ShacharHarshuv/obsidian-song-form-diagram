import * as React from "react";
import { resetSectionColors } from "./getSectionColor";
import { parseSource } from "./parser";
import { planDiagram } from "./planDiagram";
import { Segment } from "./Segment";

export function Diagram({ source }: { source: string }) {
	resetSectionColors();
	const diagramPlan = planDiagram(parseSource(source));

	return (
		<div className="flex flex-col gap-4 p-2">
			{diagramPlan.segments.map((segment, i) => (
				<Segment key={i} {...segment} />
			))}
		</div>
	);
}
