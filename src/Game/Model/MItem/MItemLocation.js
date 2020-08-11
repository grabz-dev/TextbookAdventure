import Model from './../../Model.js';

export default class MItemLocation extends Model {
    /**
     * @param {number} page
     * @param {string|null} id
     * @param {string=} _path
     */
    constructor(page, id, _path) {
        super(_path ?? 'MItem/MItemLocation.js');

        this.page = page;
        this.id = id;
    }

    /**
     * @returns {object} json 
     */
    serialize() {
        return Object.assign(super.serialize(), {
            page: this.page,
            id: this.id,
        });
    }

    /**
     * @param {any} obj 
     */
    deserialize(obj) {
        this.page = obj.page;
        this.id = obj.id;
    }
}