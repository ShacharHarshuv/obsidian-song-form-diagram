import * as React from "react";
import { Bar } from "./Bar";
import { Note } from "./DiagramData";
import { InlineSection } from "./InlineSection";
import { SystemPlan } from "./planDiagram";

const noteAlignmentToClass: Record<Note["alignment"], string> = {
	center: "justify-self-end relative",
	right: "justify-self-start",
	left: "justify-self-end",
};

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
			{data.bottomNotes.map(({ text, position, alignment }, i) => (
				<div
					key={i}
					className={noteAlignmentToClass[alignment]}
					style={{
						gridColumnStart: position,
						gridRowStart: maxNestedLevel + 3,
					}}
				>
					<span
						className={
							alignment === "center"
								? "absolute left-0 -translate-x-1/2 transform"
								: ""
						}
					>
						{text}
					</span>
				</div>
			))}
		</div>
	);
}
