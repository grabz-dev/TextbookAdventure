/** @typedef {import('./../EntryPoint.js').default} Game.EntryPoint */
/** @typedef {import('./../Model/MItem.js').default} MItem */

import View from './../View.js';
import Utility from './../../Utility/Utility.js';

import Parser from './VBook/Parser.js';

export default class VItems extends View {
    /**
     * 
     * @param {Game.EntryPoint} game 
     * @param {{
        bookl: HTMLElement,
        bookr: HTMLElement,
        inventory: HTMLElement,
        journal: HTMLElement,
        restart: HTMLElement
    }} elems
     */
    constructor(game, elems) {
        super(game);
        this.elems = elems;

        /** @type {Map<string, HTMLElement>} */
        this.inventory = new Map();
        /** @type {Map<string, HTMLElement>} */
        this.journal = new Map();

        let content = this.elems.bookl.querySelector('iframe.bookl-content');
        if(!(content instanceof HTMLIFrameElement))
            throw new Error();
        if(!content.contentDocument)
            throw new Error();
        
        let head = content.contentDocument.head;
        head.innerHTML = '<link rel="stylesheet" href="./src/Data/book/style.css">';
        this.root = content.contentDocument.body;

        this.parser = new Parser(this.game, this.root);

        this.elems.restart.addEventListener('click', () => this.game.controller.cBook.restart());
    }

    init() {
        //TODO textcontent repeated

        for(let key of Object.keys(this.save.book.items)) {
            let item = this.save.book.items[key];
            let tItem = this.game.template.tItem();
            for(let elem of this.elems.inventory.querySelectorAll('.inventory-content')) {
                elem.appendChild(tItem);
            }
            this.inventory.set(key, tItem);
            tItem.textContent = `${item.count}x ${this.data.book.items[key]?.name}`;
        }

        for(let key of Object.keys(this.save.book.entries)) {
            let entry = this.save.book.entries[key];
            let tEntry = this.game.template.tEntry();
            for(let elem of this.elems.journal.querySelectorAll('.journal-content')) {
                elem.appendChild(tEntry);
            }
            this.journal.set(key, tEntry);
            tEntry.textContent = `${this.data.book.entries[key]?.values[entry.value]}`;
        }
    }

    restart() {
        for(let elem of this.inventory.values()) {
            elem.remove();
        }
        this.inventory.clear();

        for(let elem of this.journal.values()) {
            elem.remove();
        }
        this.journal.clear();
    }

    /**
     * 
     * @param {number} page 
     */
    async switchPage(page) {
        let pResp = fetch(`./src/Data/book/${page}.html`);

        this.elems.bookl.style.transition = 'opacity 200ms';
        this.elems.bookl.style.opacity = '0';
        await Utility.Promise.event(this.elems.bookl, 'transitionend');

        let response = await pResp;
        if(!response.ok) {
            console.error('HTTP-Error: ' + response.status);
            return;
        }

        let text = await response.text();

        let div = document.createElement('div');
        div.innerHTML = text;

        this.root.innerHTML = '';

        this.parser.execute(div);
        let pParse = this.parser.postExecute();

        for(let elem of this.elems.bookl.querySelectorAll('.bookl-footer-pagenumber')) {
            elem.textContent = page+'';
        }

        this.elems.bookl.style.transition = 'opacity 700ms';
        this.elems.bookl.style.opacity = '1';
        await Utility.Promise.event(this.elems.bookl, 'transitionend');

        await pParse;
    }

    /**
     * 
     * @param {string} key 
     */
    addItem(key) {
        let item = this.save.book.items[key];
        let tItem = this.inventory.get(key);
        if(tItem == null) {
            tItem = this.game.template.tItem();
            for(let elem of this.elems.inventory.querySelectorAll('.inventory-content')) {
                elem.appendChild(tItem);
            }
            this.inventory.set(key, tItem);
        }

        tItem.textContent = `${item.count}x ${this.data.book.items[key]?.name}`;
        this.parser.refreshItems();
    }

    /**
     * 
     * @param {string} key 
     */
    addEntry(key) {
        let entry = this.save.book.entries[key];
        let tEntry = this.journal.get(key);
        if(tEntry == null) {
            tEntry = this.game.template.tEntry();
            for(let elem of this.elems.journal.querySelectorAll('.journal-content')) {
                elem.appendChild(tEntry);
            }
            this.journal.set(key, tEntry);
        }

        tEntry.textContent = `${this.data.book.entries[key]?.values[entry.value]}`;
        this.parser.refreshEntries();
    }
}
