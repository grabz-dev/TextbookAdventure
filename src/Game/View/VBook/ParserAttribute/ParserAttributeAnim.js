/** @typedef {import('../../../EntryPoint.js').default} Game.EntryPoint */

import Utility from '../../../../Utility/Utility.js';
import ParserAttribute from '../ParserAttribute.js';

export default class ParserAttributeAnim extends ParserAttribute {
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
    }

    /**
     * 
     * @param {Element} elem 
     */
    async start(elem) {
        super.start(elem);

        let internal = elem.getAttribute('data-anim');
        let delay = elem.getAttribute('data-anim-delay');
        let postAction = elem.getAttribute('data-anim-postaction');

        switch(internal) {
        case 'spell': {
            let spellSpeed = Number(elem.getAttribute('data-anim-spell-speed'));
            spellSpeed = 1 / spellSpeed * 1000;
            if(spellSpeed <= 0)
                spellSpeed = 3000;

            await parseTextRecursively(scoopTextRecursively([], elem), elem, spellSpeed);

            if(postAction === 'delete') elem.remove();

            break;
        }
        }
    }
}

/**
 * @param {string[]} arr
 * @param {ChildNode} rootChildNode 
 */
function scoopTextRecursively(arr, rootChildNode) {
    for(let childNode of rootChildNode.childNodes) {
        if(!(childNode instanceof Element)) {
            arr.push(childNode.textContent??'');
            childNode.textContent = '';
        }
        else {
            scoopTextRecursively(arr, childNode);
        }
    }
    return arr;
}

/**
 * @param {string[]} arr
 * @param {ChildNode} rootChildNode 
 * @param {number} spellSpeed
 */
async function parseTextRecursively(arr, rootChildNode, spellSpeed) {
    for(let childNode of rootChildNode.childNodes) {
        if(!(childNode instanceof Element)) {
            let text = arr[0];
            for(let i = 0; i < text.length; i++) {
                childNode.textContent += text[i];
                await Utility.Promise.sleep(spellSpeed);
            }
            arr.splice(0, 1);
        }
        else {
            await parseTextRecursively(arr, childNode, spellSpeed);
        }
    }
}