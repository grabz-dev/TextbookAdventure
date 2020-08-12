/** @typedef {import('./../../EntryPoint.js').default} Game.EntryPoint */

import ParserAttribute from './ParserAttribute.js';
import ParserAttributePage from './ParserAttribute/ParserAttributePage.js';
import ParserAttributeItem from './ParserAttribute/ParserAttributeItem.js';
import ParserAttributeAnim from './ParserAttribute/ParserAttributeAnim.js';

export default class Parser {
    /**
     * 
     * @param {Game.EntryPoint} game 
     */
    constructor(game) {
        this.game = game;

        /** @type {Object.<string, ParserAttribute|undefined>} */
        this.parsers = {
            'data-page': new ParserAttributePage(game),
            'data-item': new ParserAttributeItem(game),
            'data-anim': new ParserAttributeAnim(game)
        };
    }

    /**
     * @param {Element} container
     * @param {ChildNode} root 
     */
    execute(container, root) {
        for(let child of [...root.childNodes])
            process.bind(this)(container, child);
    }

    /**
     * 
     * @param {Element} root 
     */
    async postExecute(root) {
        let promises = [];

        for(let child of [...root.children])
            promises.push(postProcess.bind(this)(child));

        for(let promise of promises)
            await promise;
    }
}

/**
 * @this {Parser}
 * @param {Element} container
 * @param {ChildNode} root 
 */
function process(container, root) {
    if(!(root instanceof Element)) {
        let node = document.createTextNode(root.textContent??'');
        container.appendChild(node);
        return;
    }

    let node = document.createElement(root.nodeName);
    let newContainer = container.appendChild(node);
    node.className = root.className;
    for(let attributeName of root.getAttributeNames()) {
        node.setAttribute(attributeName, root.getAttribute(attributeName)??'');
    }
    
    for(let attributeName of node.getAttributeNames()) {
        let parser = this.parsers[attributeName];
        if(parser) {
            parser.awake(node);
        }
    }

    this.execute(newContainer, root);
}

/**
 * @this {Parser}
 * @param {Element} root 
 */
async function postProcess(root) {
    for(let attributeName of root.getAttributeNames()) {
        let parser = this.parsers[attributeName];
        if(parser) {
            await parser.start(root);
        }
    }

    await this.postExecute(root);
}