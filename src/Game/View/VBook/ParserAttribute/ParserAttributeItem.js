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
     * @param {Element} elem
     */
    awake(elem) {
        super.awake(elem);

        let internal = elem.getAttribute('data-item');
        if(internal == null)
            return;

        let id = elem.getAttribute('data-item-id');
        let name = elem.getAttribute('data-item-name');
        let description = elem.getAttribute('data-item-description');
        let collected = !!elem.getAttribute('data-item-collected');

        let count = Number(elem.getAttribute('data-item-count'));
        if(!Number.isFinite(count) || count <= 0)
            count = 1;
        
        if(collected || this.game.controller.cBook.hasPickedUpItem(internal, this.game.model.save.book.page, id)) {
            elem.setAttribute('data-item-collected', '');
        }
        else {
            ((internal) => {
                let listener = async () => {
                    this.game.controller.cBook.addItem(internal, this.game.model.save.book.page, id, count, name, description);
                    elem.removeEventListener('click', listener);
                    await this.awake(elem);
                };
                elem.addEventListener('click', listener);
            })(internal);
        }
    }
}