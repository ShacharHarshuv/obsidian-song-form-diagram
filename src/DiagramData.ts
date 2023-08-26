export type Bar = {
	type: "bar";
};

export type Section = {
	type: "section";
	label: string | null;
	segments: Segment[];
};

export type Segment = Section | Bar;

export type DiagramData = Segment[];
