import { DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { DiagramPlan, planDiagram } from "./planDiagram";

describe("planDiagram", () => {
	function testPlanDiagram(input: DiagramData, expected: DiagramPlan) {
		expect(planDiagram(input)).toEqual(expected);
	}

	test("one system", () => {
		testPlanDiagram(fillArray(8, { type: "bar" }), {
			paddingLevel: 0,
			segments: [
				{
					type: "system",
					fullRowLength: 8,
					bars: fillArray(8, (i) => ({ index: i })),
					inlineSections: [],
				},
			],
		});
	});

	test("two systems", () => {
		testPlanDiagram(fillArray(16, { type: "bar" }), {
			paddingLevel: 0,
			segments: fillArray(2, (lineIndex) => ({
				type: "system",
				fullRowLength: 8,
				bars: fillArray(8, (i) => ({ index: lineIndex * 8 + i })),
				inlineSections: [],
			})),
		});
	});

	test("two full systems", () => {
		testPlanDiagram(fillArray(10, { type: "bar" }), {
			paddingLevel: 0,
			segments: [
				{
					type: "system",
					fullRowLength: 8,
					bars: fillArray(8, (i) => ({ index: i })),
					inlineSections: [],
				},
				{
					type: "system",
					fullRowLength: 8,
					bars: fillArray(2, (i) => ({ index: 8 + i })),
					inlineSections: [],
				},
			],
		});
	});

	describe("multi-system section", () => {
		test("one system", () => {
			testPlanDiagram(
				[
					{
						type: "section",
						label: null,
						segments: fillArray(8, { type: "bar" }),
					},
					...fillArray(2, { type: "bar" as const }),
				],
				{
					paddingLevel: 1,
					segments: [
						{
							type: "multi-system-section",
							label: null,
							paddingLevel: 0,
							segments: [
								{
									type: "system",
									bars: fillArray(8, (i) => ({ index: i })),
									fullRowLength: 8,
									inlineSections: [],
								},
							],
						},
						{
							type: "system",
							fullRowLength: 8,
							bars: fillArray(2, (i) => ({ index: 8 + i })),
							inlineSections: [],
						},
					],
				},
			);
		});

		test("two systems", () => {
			testPlanDiagram(
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
					paddingLevel: 2,
					segments: [
						{
							type: "multi-system-section",
							label: "Verse",
							paddingLevel: 1,
							segments: [
								{
									type: "system",
									fullRowLength: 8,
									inlineSections: [],
									bars: fillArray(8, (i) => ({ index: i })),
								},
							],
						},
						{
							type: "multi-system-section",
							label: "Chorus",
							paddingLevel: 1,
							segments: ["A", "A", "B", "A"].map(
								(label, lineIndex) => ({
									type: "multi-system-section",
									label,
									paddingLevel: 0,
									segments: [
										{
											type: "system",
											fullRowLength: 8,
											inlineSections: [],
											bars: fillArray(8, (i) => ({
												index: 8 + lineIndex * 8 + i,
											})),
										},
									],
								}),
							),
						},
					],
				},
			);
		});
	});

	describe("inline section", () => {
		test("one system", () => {
			testPlanDiagram(
				[
					{
						type: "section",
						label: "Basic Idea",
						segments: fillArray(2, { type: "bar" }),
					},
					{
						type: "section",
						label: "Rep. Basic Idea",
						segments: fillArray(2, { type: "bar" }),
					},
					{
						type: "section",
						label: "Development",
						segments: fillArray(2, { type: "bar" }),
					},
					{
						type: "section",
						label: "Cadence",
						segments: fillArray(2, { type: "bar" }),
					},
					{
						type: "section",
						label: "Cadence Rep.",
						segments: fillArray(2, { type: "bar" }),
					},
				],
				{
					paddingLevel: 0,
					segments: [
						{
							type: "system",
							fullRowLength: 8,
							bars: fillArray(8, (i) => ({ index: i })),
							inlineSections: [
								{
									type: "inline-section",
									label: "Basic Idea",
									start: 0,
									end: 2,
									level: 0,
								},
								{
									type: "inline-section",
									label: "Rep. Basic Idea",
									start: 2,
									end: 4,
									level: 0,
								},
								{
									type: "inline-section",
									label: "Development",
									start: 4,
									end: 6,
									level: 0,
								},
								{
									type: "inline-section",
									label: "Cadence",
									start: 6,
									end: 8,
									level: 0,
								},
							],
						},
						{
							type: "system",
							fullRowLength: 8,
							bars: fillArray(2, (i) => ({ index: 8 + i })),
							inlineSections: [
								{
									type: "inline-section",
									label: "Cadence Rep.",
									start: 0,
									end: 2,
									level: 0,
								},
							],
						},
					],
				},
			);
		});

		test("nested", () => {
			testPlanDiagram(
				[
					{
						type: "section",
						label: "Antecedent",
						segments: [
							{
								type: "section",
								label: "Basic Idea",
								segments: fillArray(2, { type: "bar" }),
							},
							{
								type: "section",
								label: "Contrasting Idea",
								segments: fillArray(2, { type: "bar" }),
							},
						],
					},
				],
				{
					paddingLevel: 0,
					segments: [
						{
							type: "system",
							fullRowLength: 8,
							bars: fillArray(4, (i) => ({ index: i })),
							inlineSections: [
								{
									type: "inline-section",
									label: "Antecedent",
									start: 0,
									end: 4,
									level: 1,
								},
								{
									type: "inline-section",
									label: "Basic Idea",
									start: 0,
									end: 2,
									level: 0,
								},
								{
									type: "inline-section",
									label: "Contrasting Idea",
									start: 2,
									end: 4,
									level: 0,
								},
							],
						},
					],
				},
			);
		});
	});
});
