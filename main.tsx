import { Plugin } from "obsidian";
import { createRoot } from "react-dom/client";
import * as React from "react";
import { SongDiagramParser } from "./components/SongDiagramParser";

export default class SongFormDiagramPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"songform",
			(source, el, ctx) => {
				const root = createRoot(el);
				root.render(
					<React.StrictMode>
						<SongDiagramParser source={source} />
					</React.StrictMode>,
				);
			},
		);
	}
}
