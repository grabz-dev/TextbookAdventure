export default class EntryPointElems {
    constructor() {
        this.all = {
            bookl: /** @type {HTMLElement} */(document.getElementById('bookl')),
            bookr: /** @type {HTMLElement} */(document.getElementById('bookr')),
            inventory: /** @type {HTMLElement} */(document.getElementById('inventory')),
            restart: /** @type {HTMLElement} */(document.getElementById('restart')),
        };

        for(let entry of Object.entries(this.all)) {
            if(!(entry[1] instanceof HTMLElement))
                throw new Error('DOM initialization error, ' + entry[0]);
        }
    }
} 
