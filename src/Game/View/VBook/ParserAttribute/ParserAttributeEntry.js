/** @typedef {import('./../../../EntryPoint.js').default} Game.EntryPoint */

import ParserAttribute from '../ParserAttribute.js';

export default class ParserAttributeEntry extends ParserAttribute {
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
    awake(elem) {
        super.awake(elem);

        let internal = elem.dataset.entry;
        if(internal == null)
            return;

        let value = elem.dataset.entryValue;
        if(value == null)
            return;

        this.game.controller.cBook.addEntry(internal, value);
    }
}