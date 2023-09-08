import * as peg from "pegjs";
import { DiagramData } from "./DiagramData";

const parser = peg.generate(`
{
  function log(label, value) {
    // console.log(label, value); // expose for debugging
    return value;
  }

  function nodeInfo(location) {
    const source = input.substring(location.start.offset, location.end.offset);
    // return { source, location }; // consider exposing in the future for better error messages
    return {}
  }

  function bar(content = []) {
    return { type: 'bar', content }
  }
}

start
  = segments:segments ws? { return log('segments', segments) }
  / ws? { return [] }

segments
  = segment:segment ws segments:segments { return log('space separated segment', [segment, ...segments]) }
  / segment:segment { return log('segment', [segment]) }
  // Not allowing bars + segments to avoid the issue of "A | B [1]" being ambivalent
  / bars:bars { return log('bars', bars) }
  / bars:barNumber ws segments:segments { return log('barNumber + segments', [...bars, ...segments]) }

segment
  = section
  / note // should this be here, or inside a bar?

ws = [ \\t\\n\\r]+

bars
  = bars1:barNumber ws? "|" ws? bars2:barLineRightSide { return log('| separated barNumber', [...bars1, ...bars2]) }
  / bar:bar ws? "|" ws? bars:barLineRightSide { return log('| separated bar', [bar, ...bars]) }
  / barNumber:barNumber { return log('barNumber', barNumber) }
  / bar:barWithChords { return log('barWithChords', [bar]) }

bar
 = barWithChords
 / ws? { return log('empty bar', {...bar(), ...nodeInfo(location()) }) }

barWithChords
  = ws? chords:chords ws? { return log('barWithChords', { ...bar(chords), ...nodeInfo(location()) }) }

barLineRightSide
  = bars:bars 
  / bar:bar {return [bar]}

note
 = "(" ws? left:":"? text:string right:":"? ws? ")" { return {type: "note", text: text, alignment: right && !left ? "left" : right && left ? "center" : "right"} }

section
  = label:string? " "? "[" " "? segments:segments " "? "]" { return { type: "section", segments, label } }
  / label:string " " bars:barNumber { return { type: "section", segments: bars, label } }
 
chords
  = chord:chord ws chords:chords { return [chord, ...chords] }
  / chord:chord { return [chord] }
  
chord
  = "-" {return { type: "chord", label: "" } }
  / label:string { return { type: "chord", label: label } }

barNumber
  = value:integer { return Array(value).fill({ ...bar(), ...nodeInfo(location()) }); }

string
  = '"' text:[^"]+ '"' { return text.join(""); }
  / text:(!([0-9\\(]) _text:[^ \\t\\n\\r"\\[\\]|: \\)\\(]+ { return _text.join("")}) { return text; }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
 `);

export function parseSource(source: string): DiagramData {
	return parser.parse(source.replace(/\s+/g, " "));
}
