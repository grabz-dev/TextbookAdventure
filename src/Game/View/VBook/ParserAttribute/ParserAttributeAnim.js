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
     * @param {HTMLElement} elem
     */
    awake(elem) {
        super.awake(elem);
    }

    /**
     * 
     * @param {HTMLElement} elem 
     */
    async start(elem) {
        await super.start(elem);

        let internal = elem.dataset.anim;
        let speed = Number(elem.dataset.animSpeed);
        let delay = Number(elem.dataset.animDelay);
        let postaction = elem.dataset.animPostaction;
        let eventEnd = elem.dataset.animEventEnd;

        if(!Number.isFinite(delay) || delay < 0)
            delay = 0;
        
        speed = 1 / speed * 1000;
        if(speed <= 0)
            speed = 3000;

        switch(internal) {
        case 'spell': {
            let arr = scoopTextRecursively([], elem);
            if(delay > 0) await Utility.Promise.sleep(delay * 1000);
            await parseTextRecursively(arr, elem, speed);

            if(postaction === 'delete') elem.remove();
            
            if(eventEnd != null)
                this.emit('end', eventEnd);

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