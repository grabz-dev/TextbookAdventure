/** @typedef {import('./../../../EntryPoint.js').default} Game.EntryPoint */

import ParserAttribute from '../ParserAttribute.js';

export default class ParserAttributeItem extends ParserAttribute {
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

        let internal = elem.dataset.item;
        if(internal == null)
            return;

        let id = elem.dataset.itemId;
        let collected = !!elem.dataset.itemCollected;
        let count = Number(elem.dataset.itemCount);

        if(!Number.isFinite(count) || count <= 0)
            count = 1;
        
        if(collected || this.game.controller.cBook.hasPickedUpItem(internal, this.game.model.save.book.page, id))
            elem.dataset.itemCollected = '';
        else {
            ((internal) => {
                let listener = () => {
                    this.game.controller.cBook.addItem(internal, this.game.model.save.book.page, id, count);
                    elem.removeEventListener('click', listener);
                    this.awake(elem);
                };
                elem.addEventListener('click', listener);
            })(internal);
        }
    }
}