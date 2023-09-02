import React from "react";
import { BarPlan } from "./planDiagram";

export function Bar(
	data: BarPlan & {
		style?: React.CSSProperties;
	},
) {
	return (
		<div
			className="relative flex h-8 border-r-2 border-gray-500 bg-white px-1 opacity-70 shadow-md first:rounded-l-md last:rounded-r-md last:border-r-0"
			style={data.style}
		>
			<div className="text-xs text-gray-300">{data.index + 1}</div>
			<div className="flex flex-1">
				{data.content.map(({ label, space }, index) => {
					return (
						<div
							key={index}
							className="z-10 flex min-w-0 flex-1 items-center overflow-hidden font-serif text-gray-700"
							style={{ flexGrow: space }}
						>
							{label}
						</div>
					);
				})}
			</div>
		</div>
	);
}
