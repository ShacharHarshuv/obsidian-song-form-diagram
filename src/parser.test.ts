import { Bar, Chord, DiagramData } from "./DiagramData";
import { fillArray } from "./fillArray";
import { parseSource } from "./parser";

describe("parser", () => {
	test("empty", () => {
		testParser("", []);
	});

	test("bar number", () => {
		testParser("8", fillArray(8, bar()));
	});

	test("multiple bar numbers", () => {
		testParser("8 8", fillArray(16, bar()));
	});

	test("section", () => {
		testParser("[8]", [
			{
				type: "section",
				label: null,
				segments: fillArray(8, bar()),
			},
		]);
	});

	describe("multiple sections", () => {
		const expected: DiagramData = fillArray(2, {
			type: "section",
			label: null,
			segments: fillArray(8, bar()),
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
				segments: fillArray(8, bar()),
			},
			{
				type: "section",
				label: "Chorus",
				segments: fillArray(8, bar()),
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
					segments: fillArray(8, bar()),
				},
				{
					type: "section",
					label: "Chorus",
					segments: [
						{
							type: "section",
							label: "A",
							segments: fillArray(8, bar()),
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
							segments: fillArray(8, bar()),
						},
						{
							type: "section",
							label: "A",
							segments: fillArray(8, bar()),
						},
					],
				},
			],
		);
	});

	test("bottom notes", () => {
		testParser(`1 (right) 1 (:right) 1 (left:) 1 (:center:)`, [
			bar(),
			{
				type: "note",
				text: "right",
				alignment: "right",
			},
			bar(),
			{
				type: "note",
				text: "right",
				alignment: "right",
			},
			bar(),
			{
				type: "note",
				text: "left",
				alignment: "left",
			},
			bar(),
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
				segments: fillArray(4, bar()),
			},
		]);
	});

	describe("chords", () => {
		test("single chord", () => {
			testParser(`C`, [bar("C")]);
		});

		test("chords", () => {
			testParser(`C | G Am | F G Em7 Am7 | C6 - F G`, [
				bar(["C"]),
				bar(["G", "Am"]),
				bar(["F", "G", "Em7", "Am7"]),
				bar(["C6", "", "F", "G"]),
			]);
		});

		test("chords in quotes", () => {
			testParser(`"V ->" | "(ii" "V)->" | V | I`, [
				bar(["V ->"]),
				bar(["(ii", "V)->"]),
				bar(["V"]),
				bar(["I"]),
			]);
		});

		/**
		 * todo: this is currently not supported due to ambiguity
		 * Consider introducing parenthesis to solve this
		 * */
		// test("chords with named sections", () => {
		// 	testParser(`C | G Am "section" [F | G]`, [
		// 		bar(["C"]),
		// 		bar(["G", "Am"]),
		// 		{
		// 			type: "section",
		// 			label: "section",
		// 			segments: [bar(["F"]), bar(["G"])],
		// 		},
		// 	]);
		// });
	});

	describe("numbers and bar separators", () => {
		test("bar separator + number", () => {
			testParser(`| 2`, fillArray(4, bar()));
		});

		test("chord | number", () => {
			testParser(`C | 2`, [bar(["C"]), ...fillArray(3, bar())]);
		});

		test("number | chord", () => {
			testParser(`2 | C`, [...fillArray(3, bar()), bar(["C"])]);
		});

		test("number chord number", () => {
			testParser(`2 C 2`, [
				...fillArray(2, bar()),
				{
					type: "section",
					label: "C",
					segments: fillArray(2, bar()),
				},
			]);
		});

		test("number | chord | number", () => {
			testParser(`2 | C | 2`, [
				...fillArray(3, bar()),
				bar(["C"]),
				...fillArray(3, bar()),
			]);
		});
	});

	function testParser(source: string, expected: DiagramData) {
		expect(parseSource(source)).toEqual(expected);
	}

	function chord(label: string): Chord {
		return {
			type: "chord",
			label,
		};
	}

	function bar(content: string | string[] = []): Bar {
		return {
			type: "bar",
			content:
				typeof content === "string"
					? [chord(content)]
					: content.map(chord),
		};
	}
});
