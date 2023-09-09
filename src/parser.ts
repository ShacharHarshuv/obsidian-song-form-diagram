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
  / bars:barNumber ws segments:segments { return [...bars, ...segments] }
  / barNumber
  // Not allowing mixing bars annotation and segments as it's too confusing
  / bars:bars ws? rest:barNumber { return [...bars, ...rest] }
  / bars:bars { return log('bars', bars) }
  

segment
  = section
  / note

ws = [ \\t\\n\\r]+

// not including bar number
bars
  = bars:barNumber ws rest:bars { return [...bars, ...rest] }
  / bar:bar ws? "|" ws? bars:barLineRightSide { return log('| separated bar', [bar, ...bars]) }
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
