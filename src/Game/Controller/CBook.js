/** @typedef {import('./../EntryPoint.js').default} Game.EntryPoint */

import Controller from './../Controller.js';

import Utility from './../../Utility/Utility.js';
import MItem from '../Model/MItem.js';
import MItemLocation from '../Model/MItem/MItemLocation.js';
import MEntry from '../Model/MEntry.js';

export default class CBook extends Controller {
    /**
     * 
     * @param {Game.EntryPoint} game 
     */
    constructor(game) {
        super(game);
    }

    async awake() {
        let config = await (await fetch('./src/Data/book/config.json')).json();
        this.data.book.items = config.items;
        this.data.book.entries = config.entries;
    }
    
    async start() {
        if(this.save.book.page <= 0) {
            await this.restart();
        }
        else await this.game.view.vBook.switchPage(this.save.book.page);
    }
    
    async restart() {
        this.save.book.items = {};
        this.save.book.entries = {};
        this.save.book.page = 0;
        this.save.book.visited = [];
        this.switchPage(1);
        this.game.view.vBook.restart();
    }

    /**
     * 
     * @param {number} page 
     */
    async switchPage(page) {
        this.save.book.page = page;
        this.save.book.visited[page] = true;
        await this.game.view.vBook.switchPage(page);
        this.game.model.saveGame();
    }

    /**
     * @param {string} internal 
     * @param {number=} page 
     * @param {string=} id 
     */
    hasPickedUpItem(internal, page, id) {
        let item = this.save.book.items[internal];
        if(!item) return false;

        let locations = item.locations.filter(v => page === v.page);
        if(locations.length <= 0) return false;

        locations = locations.filter(v => id??null === v.id);
        if(locations.length <= 0) return false;

        return true;
    }

    /**
     * 
     * @param {string} internal 
     */
    hasItem(internal) {
        let item = this.save.book.items[internal];
        if(!item) return false;
        if(item.count <= 0) return false;
        return true;
    }

    /**
     * 
     * @param {string} internal 
     * @param {string=} value
     */
    hasEntry(internal, value) {
        let entry = this.save.book.entries[internal];
        if(!entry) return false;
        if(value != null) {
            if(entry.value !== value) return false;
        }
        return true;
    }

    /**
     * @param {string} internal 
     * @param {number} page 
     * @param {string=} id 
     * @param {number} count
     */
    addItem(internal, page, id, count) {
        if(this.hasPickedUpItem(internal, page, id))
            return false;

        let item = this.save.book.items[internal];
        if(!item) item = new MItem();
        item.count += count ?? 1;
        item.locations.push(new MItemLocation(page, id));
        this.save.book.items[internal] = item;
        this.game.view.vBook.addItem(internal);
        this.game.model.saveGame();
        return true;
    }

    /**
     * 
     * @param {string} internal 
     * @param {string} value 
     */
    addEntry(internal, value) {
        let entry = this.save.book.entries[internal];
        if(!entry) entry = new MEntry(value);
        else entry.value = value;
        entry.encountered = true;
        this.save.book.entries[internal] = entry;
        this.game.view.vBook.addEntry(internal);
        return true;
    }
}