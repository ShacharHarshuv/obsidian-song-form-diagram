import { DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { parseSource } from "./parser";

describe("parser", () => {
	const cases: [string, DiagramData][] = [
		["", []],
		[
			"8",
			fillArray(8, {
				type: "bar",
				content: [],
			}),
		],
		[
			"8 8",
			fillArray(16, {
				type: "bar",
				content: [],
			}),
		],
		[
			"[8]",
			[
				{
					type: "section",
					label: null,
					segments: fillArray(8, {
						type: "bar",
						content: [],
					}),
				},
			],
		],
		[
			"[8] [8]",
			fillArray(2, {
				type: "section",
				label: null,
				segments: fillArray(8, {
					type: "bar",
					content: [],
				}),
			}),
		],
		// spaces shouldn't matter
		[
			"[ 8 ] [ 8 ]",
			fillArray(2, {
				type: "section",
				label: null,
				segments: fillArray(8, {
					type: "bar",
					content: [],
				}),
			}),
		],
		[
			`"Verse" [8] "Chorus" [8]`,
			[
				{
					type: "section",
					label: "Verse",
					segments: fillArray(8, {
						type: "bar",
						content: [],
					}),
				},
				{
					type: "section",
					label: "Chorus",
					segments: fillArray(8, {
						type: "bar",
						content: [],
					}),
				},
			],
		],
		[
			`"Verse" 8 "Chorus" 8`,
			[
				{
					type: "section",
					label: "Verse",
					segments: fillArray(8, {
						type: "bar",
						content: [],
					}),
				},
				{
					type: "section",
					label: "Chorus",
					segments: fillArray(8, {
						type: "bar",
						content: [],
					}),
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
					segments: fillArray(8, {
						type: "bar",
						content: [],
					}),
				},
				{
					type: "section",
					label: "Chorus",
					segments: [
						{
							type: "section",
							label: "A",
							segments: fillArray(8, {
								type: "bar",
								content: [],
							}),
						},
						{
							type: "section",
							label: "A",
							segments: fillArray(8, {
								type: "bar",
								content: [],
							}),
						},
						{
							type: "section",
							label: "B",
							segments: fillArray(8, {
								type: "bar",
								content: [],
							}),
						},
						{
							type: "section",
							label: "A",
							segments: fillArray(8, {
								type: "bar",
								content: [],
							}),
						},
					],
				},
			],
		],
		[
			`1 (right) 1 (:right) 1 (left:) 1 (:center:)`,
			[
				{
					type: "bar",
					content: [],
				},
				{
					type: "note",
					text: "right",
					alignment: "right",
				},
				{
					type: "bar",
					content: [],
				},
				{
					type: "note",
					text: "right",
					alignment: "right",
				},
				{
					type: "bar",
					content: [],
				},
				{
					type: "note",
					text: "left",
					alignment: "left",
				},
				{
					type: "bar",
					content: [],
				},
				{
					type: "note",
					text: "center",
					alignment: "center",
				},
			],
		],
		// Bars with separator
		[
			`"Section" [ | | | ]`,
			[
				{
					type: "section",
					label: "Section",
					segments: fillArray(4, {
						type: "bar",
						content: [],
					}),
				},
			],
		],
		// Chords
		[
			`C | G Am | F G Em7 Am7 | C6 - F G`,
			[
				["C"],
				["G", "Am"],
				["F", "G", "Em7", "Am7"],
				["C6", "", "F", "G"],
			].map((chords) => ({
				type: "bar",
				content: chords.map((label) => ({
					type: "chord",
					label,
				})),
			})),
		],
	];

	test.each(cases)("parseSource(%p) should return %p", (source, expected) => {
		expect(parseSource(source)).toEqual(expected);
	});
});
