/** @typedef {import('./../../../EntryPoint.js').default} Game.EntryPoint */

import ParserAttribute from '../ParserAttribute.js';

export default class ParserAttributePage extends ParserAttribute {
    /**
     * 
     * @param {Game.EntryPoint} game 
     */
    constructor(game) {
        super(game);
    }

    /**
     * @param {HTMLElement} elem
     */
    async start(elem) {
        await super.start(elem);

        let page = Number(elem.dataset.page);
        if(!Number.isFinite(page) || page <= 0)
            page = 1;

        elem.textContent = elem.textContent + ` (Page ${page})`;
        elem.addEventListener('click', () => this.game.controller.cBook.switchPage(page));
        if(this.game.model.save.book.visited[page])
            elem.dataset.pageVisited = '';
    }
}