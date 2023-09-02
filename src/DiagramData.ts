export type Bar = {
	type: "bar";
	content: Chord[];
};

export type Section = {
	type: "section";
	label: string | null;
	segments: Segment[];
};

export type Chord = {
	type: "chord";
	label: string;
};

export type Note = {
	type: "note";
	text: string;
	alignment: "right" | "left" | "center";
};

export type Segment = Section | Bar | Note;

export type DiagramData = Segment[];
