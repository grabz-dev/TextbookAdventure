/** @typedef {import('./MItem/MItemLocation.js').default} MItemLocation */

import Model from './../Model.js';

export default class MItem extends Model {
    /**
     * @param {string=} _path
     */
    constructor(_path) {
        super(_path ?? 'MItem.js');

        this.count = 0;
        this.locations = /** @type {MItemLocation[]} */([]);
    }

    /**
     * @returns {object} json 
     */
    serialize() {
        return Object.assign(super.serialize(), {
            count: this.count,
            locations: this.locations
        });
    }

    /**
     * @param {any} obj 
     */
    deserialize(obj) {
        this.count = obj.count;
        this.locations = obj.locations;
    }
}