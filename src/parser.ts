import * as peg from "pegjs";
import { DiagramData } from "./DiagramData";

const parser = peg.generate(`
start
  = segments
  / " "? { return [] }

segments
  = segment:segment segments:(" " _segment:segment { return _segment })* { return [segment, ...segments].flat() }

segment
  = bars
  / note
  / section

note
 = "(" " "? left:":"? text:[^\\^:)]+ right:":"? " "? ")" { return [{type: "note", text: text.join(""), alignment: right && !left ? "left" : right && left ? "center" : "right"}] }

section
  = label:string? " "? "[" " "? segments:segments " "? "]" { return [{ type: "section", segments, label }] }
  / label:string " " bars:barNumber { return [{ type: "section", segments: bars, label }] }

bars
  = barNumber
  / bar:bar bars:(" "? "|" " "? _bar:bar {return _bar})+ { return [bar, ...bars] }
  
bar
 = chords:chords { return { type: "bar", content: chords } }
 / " "* { return { type: "bar", content: [] } }
 
chords
  = chord:chord chords:(" " _chord:chord { return _chord })* { return [chord, ...chords] }
  
chord
  = "-" {return { type: "chord", label: "" } }
  / label:[^ |\\[\\]]+ { return { type: "chord", label: label.join("") } }

barNumber
  = value:integer { return Array(value).fill({ type: "bar", content: [] }); }

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
