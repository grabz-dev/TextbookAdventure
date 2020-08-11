/** @typedef {import('./../EntryPoint.js').default} Game.EntryPoint */
/** @typedef {import('./../Model/MItem.js').default} MItem */

import View from './../View.js';

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
        let response = await fetch(`/src/Data/book/${page}.html`);
        if(!response.ok) {
            console.error('HTTP-Error: ' + response.status);
            return;
        }

        let text = await response.text();

        let div = document.createElement('div');
        div.innerHTML = text;

        this.process(div);

        for(let elem of this.elems.bookl.querySelectorAll('.bookl-content')) {
            elem.innerHTML = '';
            elem.appendChild(div);
        }

        for(let elem of this.elems.bookl.querySelectorAll('.bookl-footer-pagenumber')) {
            elem.textContent = page+'';
        }
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

    /**
     * 
     * @param {HTMLElement} elem 
     */
    process(elem) {
        for(let child of elem.children) {
            if(child.nodeName === 'A') {
                for(let name of child.getAttributeNames()) {
                    switch(name) {
                    case 'data-page': {
                        let page = child.getAttribute('data-page');
                        if(Number(page) > 0) {
                            child.textContent = `[Page ${page}] ` + child.textContent;
                            child.addEventListener('click', () => this.game.controller.cBook.switchPage(Number(page)));
                            if(this.save.book.visited[Number(page)])
                                child.setAttribute('data-page-visited', '');
                        }
                        break;
                    }
                    case 'data-item': {
                        let internal = child.getAttribute('data-item');
                        let id = child.getAttribute('data-item-id');
                        let name = child.getAttribute('data-item-name');
                        let description = child.getAttribute('data-item-description');
                        let collected = child.getAttribute('data-item-collected');

                        let count = Number(child.getAttribute('data-item-count'));
                        if(!(count > 0))
                            count = 1;
                        if(description == null)
                            description = '';


                        if(internal == null) break;
                        
                        if(collected || this.game.controller.cBook.hasPickedUpItem(internal, this.save.book.page, id)) {
                            child.setAttribute('data-item-collected', '');
                        }
                        else {
                            child.addEventListener('click', ((internal) => {
                                return async () => {
                                    this.game.controller.cBook.addItem(internal, this.save.book.page, id, count, name, description);
                                    await this.switchPage(this.save.book.page);
                                };
                            })(internal));
                        }
            
                        break;
                    }
                    }
                }
                
            }




            
            if(child instanceof HTMLElement)
                this.process(child);
        }
    }
}