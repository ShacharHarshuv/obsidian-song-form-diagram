start
  = sections:section+ { return { sections }; }

section
  = barSection:barSection { return { type: "bar", ...barSection }; }
  / groupSection:groupSection { return { type: "section", ...groupSection }; }

barSection
  = count:[0-9]+ { return { count: parseInt(count.join(''), 10) }; }

groupSection
  = "[" bars:barSection+ "]" { return { bars: Array.from({length: bars.length}, () => ({ type: "bar", ...bars[0] })) }; }
