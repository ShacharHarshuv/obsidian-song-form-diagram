import React, { HTMLAttributes } from "react";

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

export function Section({ children }: { children: string }) {
	return (
		<div className="col-span-2 col-start-3 row-start-2 -m-1 flex items-center justify-center rounded-md bg-red-400 bg-opacity-70 p-1 align-middle">
			{children}
		</div>
	);
}

export function SongDiagram({ data }: { data: DiagramInput }) {
	let numberOfBars = 32;
	const rowLength = 8;
	const rows: {
		barNum: number;
	}[][] = [];

	let barNum = 1;
	while (numberOfBars > 0) {
		const barsInRow = Math.min(numberOfBars, rowLength);
		numberOfBars -= barsInRow;
		const row: (typeof rows)[0] = [];
		for (let i = 0; i < barsInRow; i++) {
			row.push({
				barNum: barNum++,
			});
		}
		rows.push(row);
	}
	console.log(rows);

	return (
		<div className="row-span-1 grid grid-cols-8 grid-rows-1 gap-x-1 gap-y-4">
			{rows.map((row, rowIndex) =>
				row.map((bar, indexInRow) => {
					return (
						<Bar
							style={{
								gridColumnStart: indexInRow + 1,
								gridRowStart: rowIndex + 1,
							}}
						/>
					);
				}),
			)}
			{data.sections.map((section) => {
				return <Section>{section.label}</Section>;
			})}
		</div>
	);
}
