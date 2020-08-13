export default class EventEmitter {
    constructor() {
        /**
         * @type {Object.<string, ((...args: any[]) => void)[]>}
         */
        this.listeners = {};
    }

    /**
     * 
     * @param {string} e
     * @param  {(...args: any[]) => void} f
     */
    on(e, f) {
        if(!this.listeners[e])
            this.listeners[e] = [];
        this.listeners[e].push(f);
    }

    /**
     * 
     * @param {string} e 
     * @param  {...any} args 
     */
    emit(e, ...args) {
        if(!this.listeners[e])
            return;
        for(let listener of this.listeners[e])
            listener(...args);
    }
}