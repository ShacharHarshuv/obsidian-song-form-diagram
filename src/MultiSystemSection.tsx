import classNames from "classnames";
import * as React from "react";
import { Segment } from "./Segment";
import { getSectionColor } from "./getSectionColor";
import { MultiSystemSectionPlan } from "./planDiagram";

const horizontalPaddings = [
	"px-2 -mx-2",
	"px-4 -mx-4",
	"px-6 -mx-6",
	"px-8 -mx-8",
	"px-10 -mx-10",
	"px-12 -mx-12",
	"px-14 -mx-14",
];

export function MultiSystemSection(
	data: MultiSystemSectionPlan & {
		nested: boolean;
	},
) {
	const color = getSectionColor(data.label);

	return (
		<div className="mb-2 mt-2">
			{data.label && (
				<div
					className="-mt-3 mb-2 text-lg font-bold"
					style={data.nested ? {} : { color }}
				>
					{data.label}
				</div>
			)}
			<div
				className={classNames(
					"-my-2 flex flex-col gap-4 rounded-xl py-2",
					{
						"shadow-md": !data.nested,
						"border-2": data.nested,
					},
					horizontalPaddings[data.nestingLevel],
				)}
				style={data.nested ? {} : { backgroundColor: color }}
			>
				{data.segments.map((segment, i) => (
					<Segment key={i} {...segment} nested />
				))}
			</div>
		</div>
	);
}
