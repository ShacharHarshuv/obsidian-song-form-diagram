import { DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { DiagramPlan, planDiagram } from "./planDiagram";

describe("planDiagram", () => {
	const cases: [DiagramData, DiagramPlan][] = [
		[
			fillArray(8, { type: "bar" }),
			{
				segments: [
					{
						type: "system",
						fullRowLength: 8,
						bars: fillArray(8, {}),
					},
				],
			},
		],
		[
			fillArray(16, { type: "bar" }),
			{
				segments: fillArray(2, {
					type: "system",
					fullRowLength: 8,
					bars: fillArray(8, {}),
				}),
			},
		],
		[
			fillArray(10, { type: "bar" }),
			{
				segments: [
					{
						type: "system",
						fullRowLength: 8,
						bars: fillArray(8, {}),
					},
					{
						type: "system",
						fullRowLength: 8,
						bars: fillArray(2, {}),
					},
				],
			},
		],
		[
			[
				{
					type: "section",
					label: null,
					segments: fillArray(8, { type: "bar" }),
				},
				...fillArray(2, { type: "bar" as const }),
			],
			{
				segments: [
					{
						type: "multi-system-section",
						label: null,
						segments: [
							{
								type: "system",
								bars: fillArray(8, {}),
								fullRowLength: 8,
							},
						],
					},
					{
						type: "system",
						fullRowLength: 8,
						bars: fillArray(2, {}),
					},
				],
			},
		],
	];

	test.each(cases)(
		"planDiagram(%p) should return %p",
		(diagramData, expected) => {
			expect(planDiagram(diagramData)).toEqual(expected);
		},
	);
});
