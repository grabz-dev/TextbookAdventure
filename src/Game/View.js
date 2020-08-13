/** @typedef {import('./EntryPoint.js').default} Game.EntryPoint */

class View {
    /**
     * 
     * @param {Game.EntryPoint} game
     */
    constructor(game) {
        this.game = game;
        this.save = game.model.save;
        this.data = game.model.data;
    }

    init() {
        
    }
}

/** @type {null|((e: MouseEvent) => void)} */
View.prototype.onClick = null;
/** @type {null|((e: MouseEvent) => void)} */
View.prototype.onMouseUp = null;
/** @type {null|((e: MouseEvent) => void)} */
View.prototype.onMouseDown = null;

export default View;