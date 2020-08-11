/** @typedef {import('./../EntryPoint.js').default} Game.EntryPoint */

import Controller from './../Controller.js';

import Utility from './../../Utility/Utility.js';
import MItem from '../Model/MItem.js';
import MItemLocation from '../Model/MItem/MItemLocation.js';

export default class CBook extends Controller {
    /**
     * 
     * @param {Game.EntryPoint} game 
     */
    constructor(game) {
        super(game);
    }

    awake() {
        if(this.save.book.page <= 0) {
            this.restart();
        }
        else this.game.view.vBook.switchPage(this.save.book.page);
    }

    restart() {
        this.save.book.inventory = {};
        this.save.book.page = 0;
        this.save.book.visited = [];
        this.switchPage(1);
        this.game.view.vBook.restart();
    }

    /**
     * 
     * @param {number} page 
     */
    switchPage(page) {
        this.save.book.page = page;
        this.save.book.visited[page] = true;
        this.game.view.vBook.switchPage(page);
        this.game.model.saveGame();
    }

    /**
     * @param {string} internal 
     * @param {number} page 
     * @param {string|null} id 
     */
    hasPickedUpItem(internal, page, id) {
        let item = this.save.book.inventory[internal];
        if(!item) return false;

        let locations = item.locations.filter(v => page === v.page);
        if(locations.length <= 0) return false;

        locations = locations.filter(v => id === v.id);
        if(locations.length <= 0) return false;

        return true;
    }

    /**
     * @param {string} internal 
     * @param {number} page 
     * @param {string|null} id 
     * @param {number} count
     * @param {string|null} name
     * @param {string|null} description
     */
    addItem(internal, page, id, count, name, description) {
        if(this.hasPickedUpItem(internal, page, id))
            return false;

        let item = this.save.book.inventory[internal];
        if(!item) item = new MItem(internal, page, id, name, description);
        item.count += count ?? 1;
        item.locations.push(new MItemLocation(page, id));
        this.save.book.inventory[internal] = item;
        this.game.view.vBook.addItem(item);
        return true;
    }
}