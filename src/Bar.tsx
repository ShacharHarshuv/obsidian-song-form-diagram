import React, { HTMLAttributes } from "react";

export function Bar(attributes: Pick<HTMLAttributes<HTMLDivElement>, "style">) {
	return (
		<div
			className="rouded-md h-8 rounded-sm border-2 opacity-50"
			{...attributes}
		></div>
	);
}
