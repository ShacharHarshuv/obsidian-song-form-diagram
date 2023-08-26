import { DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { DiagramPlan, planDiagram } from "./planDiagram";

describe("planDiagram", () => {
	const cases: [DiagramData, DiagramPlan][] = [
		[
			fillArray(8, { type: "bar" }),
			{
				nestingLevel: 0,
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
				nestingLevel: 0,
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
				nestingLevel: 0,
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
				nestingLevel: 1,
				segments: [
					{
						type: "multi-system-section",
						label: null,
						nestingLevel: 0,
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
		[
			[
				{
					type: "section",
					label: "Verse",
					segments: fillArray(8, { type: "bar" }),
				},
				{
					type: "section",
					label: "Chorus",
					segments: [
						{
							type: "section",
							label: "A",
							segments: fillArray(8, { type: "bar" }),
						},
						{
							type: "section",
							label: "A",
							segments: fillArray(8, { type: "bar" }),
						},
						{
							type: "section",
							label: "B",
							segments: fillArray(8, { type: "bar" }),
						},
						{
							type: "section",
							label: "A",
							segments: fillArray(8, { type: "bar" }),
						},
					],
				},
			],
			{
				nestingLevel: 2,
				segments: [
					{
						type: "multi-system-section",
						label: "Verse",
						nestingLevel: 1,
						segments: [
							{
								type: "system",
								fullRowLength: 8,
								bars: fillArray(8, {}),
							},
						],
					},
					{
						type: "multi-system-section",
						label: "Chorus",
						nestingLevel: 1,
						segments: ["A", "A", "B", "A"].map((label) => ({
							type: "multi-system-section",
							label,
							nestingLevel: 0,
							segments: [
								{
									type: "system",
									fullRowLength: 8,
									bars: fillArray(8, {}),
								},
							],
						})),
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
