import * as React from "react";
import { parse } from "yaml";
import { DiagramInput, SongDiagram } from "./SongDiagram";

// todo: validate the input
// const ajv = new Ajv();
// const validate = ajv.compile<DiagramInput>({
//   type: 'object',
//   properties: {
//     label: { type: 'string' },
//     bars: {
//       type: 'string',
//       pattern: '^\\d+-\\d+$',
//     },
//     // required: ['label', 'bars'],
//   },
//   // required: ['sections'],
// });

export function SongDiagramParser({ source }: { source: string }) {
	const parsed = parse(source);

	return (
		<>
			<SongDiagram data={parsed as DiagramInput} />
		</>
	);
}
