import classNames from "classnames";
import * as React from "react";
import { Segment } from "./Segment";
import { resetSectionColors } from "./getSectionColor";
import { parseSource } from "./parser";
import { planDiagram } from "./planDiagram";

const horizontalPaddings = [
	"px-0",
	"px-2",
	"px-4",
	"px-6",
	"px-8",
	"px-10",
	"px-12",
	"px-14",
];

export function Diagram({ source }: { source: string }) {
	resetSectionColors();
	const diagramPlan = planDiagram(parseSource(source));

	return (
		<div
			className={classNames(
				"flex flex-col gap-4 py-2",
				horizontalPaddings[diagramPlan.paddingLevel],
			)}
		>
			{diagramPlan.segments.map((segment, i) => (
				<Segment key={i} {...segment} nested={false} />
			))}
		</div>
	);
}
