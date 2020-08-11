import EntryPoint from './../EntryPoint.js';
import EntryPointDOM from './EntryPointDOM.js';

import VBook from './../View/VBook.js';

export default class EntryPointView {
    /**
     * 
     * @param {EntryPoint} game
     * @param {EntryPointDOM} elems 
     */
    constructor(game, elems) {
        this.vBook = new VBook(game, 0, {
            bookl: elems.all.bookl,
            bookr: elems.all.bookr,
            inventory: elems.all.inventory,
            restart: elems.all.restart,
        });
    }
}