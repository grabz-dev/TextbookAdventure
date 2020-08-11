/** @typedef {import('./../Model/MItem.js').default} MItem */

export default class EntryPointModel {
    constructor() {
        this.save = {
            version: 2,
            timeElapsed: 0,
            timestamp: 0,

            book: {
                page: 0,
                inventory: /** @type {Object.<string, MItem>} */({}),
                visited: /** @type {boolean[]} */([]),
            }
        };

        this.data = {
            mouse: {
                x: 0,
                y: 0
            },
        };

        this.save.timestamp = Date.now();
    }

    saveGame() {
        this.save.timestamp = Date.now();
        localStorage.setItem('game_textbookadventure', JSON.stringify(this.save));
    }

    async loadGame() {
        let json = localStorage.getItem('game_textbookadventure');
        if(json == null) return;

        let save = JSON.parse(json);
        save = compat(save);
        
        /** @type {({parent: any, childName: string}[])[]} */
        var arr = [];
        crawl(0, arr, save);
        for(let depth = arr.length - 1; depth >= 0; depth--) {
            for(let obj of arr[depth]) {
                let mObj = obj.parent[obj.childName];
                let v = await import(`./../Model/${mObj._path}`);
                let m = new v.default();
                m.deserialize(mObj);
                obj.parent[obj.childName] = m;
            }
        }

        assign(this.save, save);
    }
}

/**
 * Make the save compatible with the current version.
 * @param {any} save
 * @returns {any}
 */
function compat(save) {
    return save;
}

/**
 * 
 * @param {number} depth 
 * @param {({parent: any, childName: string}[])[]} arr 
 * @param {any} parent 
 * @param {string=} childName 
 */
function crawl(depth, arr, parent, childName) {
    if(arr[depth] == null)
        arr[depth] = [];

    let child = childName == null ? parent : parent[childName];
    if(child == null) return;

    if(typeof child._path !== 'undefined') {
        arr[depth].push({ parent: parent, childName: childName??'' });
    }

    let keys = Object.keys(child);
    for(let key of keys) {
        let property = child[key];

        if(typeof property === 'object')
            crawl(depth + 1, arr, child, key);
    }
}

/**
 * 
 * @param {any} target 
 * @param  {...any} sources
 */
function assign(target, ...sources) {
    for(let source of sources) {
        for(let [key, value] of Object.entries(source)) {
            if(typeof value === 'object' && typeof target[key] === 'object')
                assign(target[key], value);
            else
                target[key] = value;
        }
    }
}