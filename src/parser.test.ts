import { DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { parseSource } from "./parser";

describe("parser", () => {
	test("empty", () => {
		testParser("", []);
	});

	test("bar number", () => {
		testParser(
			"8",
			fillArray(8, {
				type: "bar",
				content: [],
			}),
		);
	});

	test("multiple bar numbers", () => {
		testParser(
			"8 8",
			fillArray(16, {
				type: "bar",
				content: [],
			}),
		);
	});

	test("section", () => {
		testParser("[8]", [
			{
				type: "section",
				label: null,
				segments: fillArray(8, {
					type: "bar",
					content: [],
				}),
			},
		]);
	});

	describe("multiple sections", () => {
		const expected: DiagramData = fillArray(2, {
			type: "section",
			label: null,
			segments: fillArray(8, {
				type: "bar",
				content: [],
			}),
		});

		test("without spaces", () => {
			testParser("[8] [8]", expected);
		});

		test("with spaces", () => {
			testParser("[8] [ 8 ]", expected);
		});
	});

	describe("named sections", () => {
		const expected: DiagramData = [
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
		];

		test("with brackets", () => {
			testParser(`"Verse" [8] "Chorus" [8]`, expected);
		});

		test("without brackets", () => {
			testParser(`"Verse" 8 "Chorus" 8`, expected);
		});

		test("without quotes", () => {
			testParser(`Verse 8 Chorus 8`, expected);
		});
	});

	describe("nested sections", () => {
		testParser(
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
		);
	});

	test("bottom notes", () => {
		testParser(`1 (right) 1 (:right) 1 (left:) 1 (:center:)`, [
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
		]);
	});

	test("bars with separators", () => {
		testParser(`"Section" [ | | | ]`, [
			{
				type: "section",
				label: "Section",
				segments: fillArray(4, {
					type: "bar",
					content: [],
				}),
			},
		]);
	});

	describe("chords", () => {
		test("chords", () => {
			testParser(
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
			);
		});

		test("chords with named sections", () => {
			testParser(`C | G Am "section" [F | G]`, [
				{
					type: "bar",
					content: [
						{
							type: "chord",
							label: "C",
						},
					],
				},
				{
					type: "bar",
					content: [
						{
							type: "chord",
							label: "G",
						},
						{
							type: "chord",
							label: "Am",
						},
					],
				},
				{
					type: "section",
					label: "section",
					segments: [
						{
							type: "bar",
							content: [
								{
									type: "chord",
									label: "F",
								},
							],
						},
						{
							type: "bar",
							content: [
								{
									type: "chord",
									label: "G",
								},
							],
						},
					],
				},
			]);
		});
	});

	function testParser(source: string, expected: DiagramData) {
		expect(parseSource(source)).toEqual(expected);
	}
});
