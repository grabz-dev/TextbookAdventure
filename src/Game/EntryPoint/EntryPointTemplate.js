import TItem from './../Template/TItem.js';

export default class EntryPointTemplate {
    /**
     * 
     */
    constructor() {
        const template = {
            tItem: GetHTMLElementFromString(TItem),
        };

        this.tItem = () => /** @type {HTMLElement} */(template.tItem.cloneNode(true));
    }
}

/**
 * 
 * @param {string} str
 * @returns {HTMLElement} 
 */
function GetHTMLElementFromString(str) {
    const placeholder = document.createElement('div');
    placeholder.innerHTML = str;
    let elem = placeholder.children[0];
    if(!(elem instanceof HTMLElement))
        throw new Error('Template error, ' + elem);
    return elem;
}