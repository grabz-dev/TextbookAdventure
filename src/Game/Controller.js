/** @typedef {import('./EntryPoint.js').default} Game.EntryPoint */

class Controller {
    /**
     * 
     * @param {Game.EntryPoint} game 
     */
    constructor(game) {
        this.game = game;
        this.save = game.model.save;
        this.data = game.model.data;
    }
    
    async awake() {

    }

    async start() {
        
    }
}

export default Controller;