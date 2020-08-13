/** @typedef {import('./../../EntryPoint.js').default} Game.EntryPoint */

import EventEmitter from '../../../Utility/EventEmitter.js';

export default class ParserAttribute extends EventEmitter {
    /**
     * 
     * @param {Game.EntryPoint} game 
     */
    constructor(game) {
        super();
        this.game = game;
    }

    /**
     * 
     * @param {HTMLElement} elem
     */
    awake(elem) {

    }

    /**
     * 
     * @param {HTMLElement} elem
     */
    async start(elem) {

    }
}