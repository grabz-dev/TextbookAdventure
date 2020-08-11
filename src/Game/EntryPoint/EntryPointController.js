import EntryPoint from './../EntryPoint.js';

import CBook from './../Controller/CBook.js';

export default class EntryPointController {
    /**
     * 
     * @param {EntryPoint} game
     */
    constructor(game) {
        this.cBook = new CBook(game);
    }
}