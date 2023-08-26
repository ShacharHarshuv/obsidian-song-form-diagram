import { DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { parseSource } from "./parser";

describe("parser", () => {
	const cases: [string, DiagramData][] = [
		["", []],
		["8", fillArray(8, { type: "bar" })],
		["8 8", fillArray(16, { type: "bar" })],
		[
			"[8]",
			[
				{
					type: "section",
					label: null,
					segments: fillArray(8, { type: "bar" }),
				},
			],
		],
		[
			"[8] [8]",
			fillArray(2, {
				type: "section",
				label: null,
				segments: fillArray(8, { type: "bar" }),
			}),
		],
		// spaces shouldn't matter
		[
			"[ 8 ] [ 8 ]",
			fillArray(2, {
				type: "section",
				label: null,
				segments: fillArray(8, { type: "bar" }),
			}),
		],
		[
			`"Verse" [8] "Chorus" [8]`,
			[
				{
					type: "section",
					label: "Verse",
					segments: fillArray(8, { type: "bar" }),
				},
				{
					type: "section",
					label: "Chorus",
					segments: fillArray(8, { type: "bar" }),
				},
			],
		],
		[
			`"Verse" 8 "Chorus" 8`,
			[
				{
					type: "section",
					label: "Verse",
					segments: fillArray(8, { type: "bar" }),
				},
				{
					type: "section",
					label: "Chorus",
					segments: fillArray(8, { type: "bar" }),
				},
			],
		],
		[
			`"Verse" 8
      "Chorus" [
        "A" 8
        "A" 8
        "B" 8
        "A" 8
      ]`,
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
		],
	];

	test.each(cases)("parseSource(%p) should return %p", (source, expected) => {
		expect(parseSource(source)).toEqual(expected);
	});
});
