/** @typedef {import('./../EntryPoint.js').default} Game.EntryPoint */
/** @typedef {import('./../Model/MItem.js').default} MItem */

import View from './../View.js';
import Utility from './../../Utility/Utility.js';

import Parser from './VBook/Parser.js';

export default class VItems extends View {
    /**
     * 
     * @param {Game.EntryPoint} game 
     * @param {number} updateInterval
     * @param {{
        bookl: HTMLElement,
        bookr: HTMLElement,
        inventory: HTMLElement,
        restart: HTMLElement
    }} elems
     */
    constructor(game, updateInterval, elems) {
        super(game, updateInterval);
        this.elems = elems;

        /** @type {Map<MItem, HTMLElement>} */
        this.inventory = new Map();

        this.parser = new Parser(this.game);

        this.elems.restart.addEventListener('click', () => this.game.controller.cBook.restart());
    }

    restart() {
        for(let elem of this.inventory.values()) {
            elem.remove();
        }
        this.inventory.clear();
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

        for(let elem of this.elems.bookl.querySelectorAll('.bookl-content')) {
            elem.innerHTML = '';
        }

        this.parser.execute(this.elems.bookl.querySelectorAll('.bookl-content')[0], div);
        let pParse = this.parser.postExecute(this.elems.bookl.querySelectorAll('.bookl-content')[0]);

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
     * @param {MItem} item 
     */
    addItem(item) {
        let tItem = this.inventory.get(item);
        if(tItem == null) {
            tItem = this.game.template.tItem();
            for(let elem of this.elems.inventory.querySelectorAll('.inventory-content')) {
                elem.appendChild(tItem);
            }
            this.inventory.set(item, tItem);
        }

        tItem.textContent = `${item.count}x ${item.name}`;
    }
}




/*
for(let name of elem.getAttributeNames()) {
    if(elem.nodeName === 'A') {
        switch(name) {
        case 'data-page': {
            let page = elem.getAttribute('data-page');
            if(Number(page) > 0) {
                elem.textContent = `[Page ${page}] ` + elem.textContent;
                elem.addEventListener('click', () => this.game.controller.cBook.switchPage(Number(page)));
                if(this.save.book.visited[Number(page)])
                    elem.setAttribute('data-page-visited', '');
            }
            break;
        }
        case 'data-item': {
            let internal = elem.getAttribute('data-item');
            let id = elem.getAttribute('data-item-id');
            let name = elem.getAttribute('data-item-name');
            let description = elem.getAttribute('data-item-description');
            let collected = elem.getAttribute('data-item-collected');

            let count = Number(elem.getAttribute('data-item-count'));
            if(!(count > 0))
                count = 1;
            if(description == null)
                description = '';


            if(internal == null) break;
            
            if(collected || this.game.controller.cBook.hasPickedUpItem(internal, this.save.book.page, id)) {
                elem.setAttribute('data-item-collected', '');
            }
            else {
                elem.addEventListener('click', ((internal) => {
                    return async () => {
                        this.game.controller.cBook.addItem(internal, this.save.book.page, id, count, name, description);
                        await this._process(elem);
                    };
                })(internal));
            }

            break;
        }
        }
    }

    switch(name) {
    case 'data-anim': {
        let internal = elem.getAttribute('data-anim');
        
        switch(internal) {
        case 'spell': {
            let spellSpeed = Number(elem.getAttribute('data-anim-spell-speed'));
            spellSpeed = 1 / spellSpeed * 1000;
            if(spellSpeed <= 0)
                spellSpeed = 3000;
            
            let text = elem.textContent ?? '';
            elem.textContent = '';
            for(let i = 0; i < text.length; i++) {
                elem.textContent += text[i];
                await Utility.Promise.sleep(spellSpeed);
            }

            break;
        }
        }


        break;
    }
    }
}
        */