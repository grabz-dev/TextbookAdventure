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
     * @param {Element} elem
     */
    awake(elem) {
        super.awake(elem);

        let page = Number(elem.getAttribute('data-page'));
        if(!Number.isFinite(page) || page <= 0)
            page = 1;

        elem.textContent = `[Page ${page}] ` + elem.textContent;
        elem.addEventListener('click', () => this.game.controller.cBook.switchPage(page));
        if(this.game.model.save.book.visited[page])
            elem.setAttribute('data-page-visited', '');
    }
}