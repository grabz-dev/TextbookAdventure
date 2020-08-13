import Model from './../Model.js';

export default class MEntry extends Model {
    /**
     * @param {string} value
     * @param {string=} _path
     */
    constructor(value, _path) {
        super(_path ?? 'MEntry.js');

        this.value = value;
        this.encountered = false;
    }

    /**
     * @returns {object} json 
     */
    serialize() {
        return Object.assign(super.serialize(), {
            value: this.value,
            encountered: this.encountered
        });
    }

    /**
     * @param {any} obj 
     */
    deserialize(obj) {
        this.value = obj.value;
        this.encountered = obj.encountered;
    }
}