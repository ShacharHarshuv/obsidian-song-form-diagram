import * as React from "react";

export type DiagramInput = {
	sections: {
		label: string;
		bars: `${number}-${number}` | number;
	}[];
};

export function SongDiagram({ data }: { data: DiagramInput }) {
	return <>{JSON.stringify(data, null, 2)}</>;
}
