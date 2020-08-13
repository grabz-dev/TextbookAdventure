/** @typedef {import('./../../EntryPoint.js').default} Game.EntryPoint */

import ParserAttribute from './ParserAttribute.js';
import ParserAttributePage from './ParserAttribute/ParserAttributePage.js';
import ParserAttributeItem from './ParserAttribute/ParserAttributeItem.js';
import ParserAttributeEntry from './ParserAttribute/ParserAttributeEntry.js';
import ParserAttributeAnim from './ParserAttribute/ParserAttributeAnim.js';

export default class Parser {
    /**
     * 
     * @param {Game.EntryPoint} game
     * @param {HTMLElement} root
     */
    constructor(game, root) {
        this.game = game;
        this.root = root;

        /** @type {Object.<string, ParserAttribute|undefined>} */
        this.parsers = {
            page: new ParserAttributePage(game),
            item: new ParserAttributeItem(game),
            entry: new ParserAttributeEntry(game),
            anim: new ParserAttributeAnim(game)
        };

        this.parsers.anim?.on('end', event => {
            for(let elem of this.root.querySelectorAll(`[data-event-${event}]`)) {
                if(!(elem instanceof HTMLElement)) continue;
                let action = elem.dataset[`event-${event}`];
                if(action == null) continue;
                let arr = action.split('=');
                if(arr.length !== 2) continue;
                elem.setAttribute(arr[0].trim(), arr[1].trim());
            }
        });
    }

    /**
     * @param {ChildNode} book 
     * @param {HTMLElement=} root
     */
    execute(book, root) {
        for(let childNode of [...book.childNodes])
            process.bind(this)(childNode, root??this.root);
    }

    /**
     * 
     * @param {HTMLElement=} root 
     */
    async postExecute(root) {
        let promises = [];

        for(let child of [...(root??this.root).children]) {
            if(child instanceof HTMLElement)
                promises.push(postProcess.bind(this)(child));
        }

        for(let promise of promises)
            await promise;

        this.refreshItems();
        this.refreshEntries();
    }

    //TODO KISS
    refreshItems() {
        for(let elem of this.root.querySelectorAll('[data-has-item]')) {
            if(!(elem instanceof HTMLElement)) continue;
            let action = elem.dataset.hasItem;
            if(action == null) continue;
            let arr = action.split(/[:=]+/);
            if(arr.length !== 3) continue;
            if(!this.game.controller.cBook.hasItem(arr[0].trim())) continue;
            
            elem.setAttribute(arr[1].trim(), arr[2].trim());
        }
    }
    refreshEntries() {
        for(let elem of this.root.querySelectorAll('[data-has-entry]')) {
            if(!(elem instanceof HTMLElement)) continue;
            let action = elem.dataset.hasEntry;
            if(action == null) continue;
            let arr = action.split(/[:=]+/);
            if(arr.length === 4) {
                if(!this.game.controller.cBook.hasEntry(arr[0].trim(), arr[1].trim())) continue;
                elem.setAttribute(arr[2].trim(), arr[3].trim());
            }
            else if(arr.length === 3) {
                if(!this.game.controller.cBook.hasEntry(arr[0].trim())) continue;
                elem.setAttribute(arr[1].trim(), arr[2].trim());
            }
        }
    }
}

/**
 * @this {Parser}
 * @param {ChildNode} book 
 * @param {HTMLElement} root
 */
function process(book, root) {
    if(!(book instanceof Element)) {
        let node = document.createTextNode(book.textContent??'');
        root.appendChild(node);
        return;
    }

    let node = document.createElement(book.nodeName);
    let newContainer = root.appendChild(node);
    node.className = book.className;
    for(let attributeName of book.getAttributeNames()) {
        node.setAttribute(attributeName, book.getAttribute(attributeName)??'');
    }
    
    if(book instanceof HTMLElement) {
        for(let data in book.dataset) {
            let parser = this.parsers[data];
            if(parser) {
                parser.awake(node);
            }
        }
    }

    this.execute(book, newContainer);
}

/**
 * @this {Parser}
 * @param {HTMLElement} root 
 */
async function postProcess(root) {
    for(let data in root.dataset) {
        let parser = this.parsers[data];
        if(parser) {
            await parser.start(root);
        }
    }

    await this.postExecute(root);
}