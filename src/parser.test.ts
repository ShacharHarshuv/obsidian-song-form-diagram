import { DiagramData } from "./DiagramData";
import { parseSource } from "./parser";

describe("parser", () => {
	const cases: [string, DiagramData][] = [
		["", []],
		["8", Array(8).fill({ type: "bar" })],
		["8 8", Array(16).fill({ type: "bar" })],
		[
			"[8] [8]",
			Array(2).fill({
				type: "section",
				segments: Array(8).fill({ type: "bar" }),
			}),
		],
		// spaces shouldn't matter
		[
			"[ 8 ] [ 8 ]",
			Array(2).fill({
				type: "section",
				segments: Array(8).fill({ type: "bar" }),
			}),
		],
	];

	test.each(cases)("parseSource(%p) should return %p", (source, expected) => {
		expect(parseSource(source)).toEqual(expected);
	});
});
