/** @typedef {import('./Game/Model.js').default} Model */
/** @typedef {import('./Game/View.js').default} View */
/** @typedef {import('./Game/Controller.js').default} Controller */

import EntryPoint from './Game/EntryPoint.js';

const entryPoint = new EntryPoint();

/** @type {View[]} */
// @ts-ignore
const views = Object.keys(entryPoint.view).map(e => entryPoint.view[e]);
/** @type {Controller[]} */
// @ts-ignore
const controllers = Object.keys(entryPoint.controller).map(e => entryPoint.controller[e]);

document.addEventListener('click', e => {
    for(let view of views) if(view.onClick != null) view.onClick(e);
});
document.addEventListener('mouseup', e => {
    for(let view of views) if(view.onMouseUp != null) view.onMouseUp(e);
});
document.addEventListener('mousedown', e => {
    for(let view of views) if(view.onMouseDown != null) view.onMouseDown(e);
});

entryPoint.model.loadGame().then(async () => {
    for(let controller of controllers)
        await controller.awake();
    for(let view of views)
        view.init();
    for(let controller of controllers)
        await controller.start();

    setInterval(entryPoint.model.saveGame.bind(entryPoint.model), 5000);

    // @ts-ignore
    window.game = entryPoint;
});