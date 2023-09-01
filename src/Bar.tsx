import React from "react";
import { BarPlan } from "./planDiagram";

export function Bar(
	data: BarPlan & {
		style?: React.CSSProperties;
	},
) {
	return (
		<div
			className="h-8 border-2 border-black bg-white opacity-70"
			style={data.style}
		></div>
	);
}
