import classNames from "classnames";
import React, { HTMLAttributes } from "react";

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
