import { Plugin } from "obsidian";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Diagram } from "./Diagram";

export default class SongFormDiagramPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"songform",
			(source, el, ctx) => {
				const root = createRoot(el);
				root.render(
					<ErrorBoundary
						fallbackRender={({ error, resetErrorBoundary }) => {
							return (
								<div role="alert">
									<pre className="text-red-400">
										{error.message}
									</pre>
								</div>
							);
						}}
					>
						<Diagram source={source} />
					</ErrorBoundary>,
				);
			},
		);
	}
}
