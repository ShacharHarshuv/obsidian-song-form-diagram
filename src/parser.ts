import * as peg from "pegjs";
import { DiagramData } from "./DiagramData";

const parser = peg.generate(`
start
  = segments
  / " "? { return [] }

segments
  = segment:segment segments:(" " _segment:segment { return _segment })* { return [segment, ...segments].flat() }

segment
  = barNumber
  / section

section
  = label:string? " "? "[" " "? segments:segments " "? "]" { return [{ type: "section", segments, label }] }
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
	return parser.parse(source.replace(/\s+/g, " "));
}
