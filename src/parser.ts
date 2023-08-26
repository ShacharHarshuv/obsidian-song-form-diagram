import * as peg from "pegjs";
import { DiagramData } from "./DiagramData";

const parser = peg.generate(`
start
  = segments
  / " "? { return [] }

segments
  = segments:(segment:segment " " { return segment })+ { return segments.flat() }

segment
  = barNumber
  / section

section
  // todo: support naming a section
  = label:string? " "? "[" " "? bars:barNumber " "? "]" { return [{ type: "section", segments: bars, label }] }
  / label:string " " bars:barNumber { return [{ type: "section", segments: bars, label }] }

barNumber
  = value:integer { return Array(value).fill({ type: "bar" }); }

string
  = '"' chars:char+ '"' { return chars.join(""); }
  
char
  = [^"]

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
`);

export function parseSource(source: string): DiagramData {
	// adding a final space to make the grammar simpler
	return parser.parse(source.replace(/\s+/g, " ") + " ");
}
