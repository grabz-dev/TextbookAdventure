/** @typedef {import('./MItem/MItemLocation.js').default} MItemLocation */

import Model from './../Model.js';

export default class MItem extends Model {
    /**
     * @param {string} internal
     * @param {number} page
     * @param {string|null} id
     * @param {string|null} name
     * @param {string|null} description
     * @param {string=} _path
     */
    constructor(internal, page, id, name, description, _path) {
        super(_path ?? 'MItem.js');

        this.internal = internal;
        this.page = page;
        this.id = id;
        this.name = name ?? internal;
        this.description = description ?? '';

        this.count = 0;
        this.locations = /** @type {MItemLocation[]} */([]);
    }

    /**
     * @returns {object} json 
     */
    serialize() {
        return Object.assign(super.serialize(), {
            internal: this.internal,
            page: this.page,
            id: this.id,
            name: this.name,
            description: this.description
        });
    }

    /**
     * @param {any} obj 
     */
    deserialize(obj) {
        this.internal = obj.internal;
        this.page = obj.page;
        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
    }
}