export type Bar = {
	type: "bar";
};

export type Section = {
	type: "section";
	label: string | null;
	segments: Segment[];
};

export type Note = {
	type: "note";
	text: string;
	alignment: "left" | "right" | "center";
};

export type Segment = Section | Bar | Note;

export type DiagramData = Segment[];
