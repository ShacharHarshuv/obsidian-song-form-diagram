import * as React from "react";
import { parse } from "yaml";
import Ajv from "ajv";
import { SongDiagram, DiagramInput } from "./SongDiagram";

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
	try {
		const parsed = parse(source);

		// if (!validate(parsed)) {
		//   return <>
		//     Invalid input: {ajv.errorsText(validate.errors)}
		//   </>
		// }

		return (
			<>
				<SongDiagram data={parsed as DiagramInput} />
			</>
		);
	} catch (e) {
		return <>Error: {e.message}</>;
	}
}
