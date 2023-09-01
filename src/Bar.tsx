import React from "react";
import { BarPlan } from "./planDiagram";

export function Bar(
	data: BarPlan & {
		style?: React.CSSProperties;
	},
) {
	return (
		<div
			className="h-8 border-r-2 border-gray-500 bg-white opacity-60 first:rounded-l-md last:rounded-r-md last:border-r-0"
			style={data.style}
		></div>
	);
}
