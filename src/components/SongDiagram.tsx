import classNames from "classnames";
import React, { HTMLAttributes } from "react";
import { getSectionColor } from "./getSectionColor";

export type DiagramInput = {
	sections: {
		label: string;
		bars: `${number}-${number}` | number;
	}[];
};

export function Bar(attributes: Pick<HTMLAttributes<HTMLDivElement>, "style">) {
	return (
		<div
			className="rouded-md h-8 rounded-sm border-2 opacity-50"
			{...attributes}
		></div>
	);
}

const sectionColors = [
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-purple-500",
	"bg-orange-500",
	"bg-fuchsia-500",
	"bg-lime-500",
	"bg-cyan-500",
	"bg-red-500",
];

export function Section({
	children,
	colorIndex,
	...attributes
}: { children: string; colorIndex: number } & Pick<
	HTMLAttributes<HTMLDivElement>,
	"style"
>) {
	return (
		<div
			className={classNames(
				"text-md row-start-2 -m-1 flex items-center justify-center rounded-md bg-opacity-70 p-1 align-middle font-bold",
				sectionColors[colorIndex],
			)}
			{...attributes}
		>
			{children}
		</div>
	);
}

export function SongDiagram({ data }: { data: DiagramInput }) {
	const numberOfBars = 32;
	const rowLength = 8;
	const bars: {
		columnNum: number;
		rowNum: number;
		barNum: number;
	}[] = [];

	let barIndex = 0;
	let rowIndex = 0;
	let colIndex = 0;

	while (barIndex < numberOfBars) {
		bars.push({
			barNum: barIndex,
			rowNum: rowIndex,
			columnNum: colIndex,
		});

		barIndex++;
		colIndex++;
		if (colIndex >= rowLength) {
			colIndex = 0;
			rowIndex++;
		}
	}

	console.log(bars);

	return (
		<div className="row-span-1 grid grid-cols-8 grid-rows-1 gap-x-1 gap-y-4 p-2">
			{bars.map((bar, index) => (
				<Bar
					style={{
						gridColumnStart: bar.columnNum + 1,
						gridRowStart: bar.rowNum + 1,
					}}
					key={index}
				/>
			))}
			{data.sections.map(({ label, bars: barRange }, index) => {
				const [start, end] =
					typeof barRange === "number"
						? [barRange, barRange]
						: barRange.split("-").map(Number);

				if (start > end) {
					throw new Error(
						`Received invalid bar range for section "${label}", start (=${start}) must be lowwer than end (=${end})`,
					);
				}

				const startBar = bars[start - 1];
				const endBar = bars[end - 1];
				return (
					<Section
						colorIndex={getSectionColor(label)}
						style={{
							gridColumnStart: startBar.columnNum + 1,
							gridColumnEnd: endBar.columnNum + 2,
							gridRowStart: startBar.rowNum + 1,
							gridRowEnd: endBar.rowNum + 2,
						}}
					>
						{label}
					</Section>
				);
			})}
		</div>
	);
}
