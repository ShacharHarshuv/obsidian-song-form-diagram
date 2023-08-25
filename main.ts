import { Plugin } from 'obsidian';

export default class SongFormDiagramPlugin extends Plugin {
	async onload() {
    this.registerMarkdownCodeBlockProcessor('songform', (source, el, ctx) => {
      el.createEl('div').innerText = 'Hello Songchart!';
    });
	}
}

