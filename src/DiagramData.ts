export type Bar = {
	type: "bar";
};

export type Section = {
	type: "section";
	segments: Bar[]; // later this should be Segment[] recursively
};

export type Segment = Section | Bar;

export type DiagramData = Segment[];
