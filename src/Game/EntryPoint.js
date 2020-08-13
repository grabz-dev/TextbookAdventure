import EntryPointDOM from './EntryPoint/EntryPointDOM.js';
import EntryPointModel from './EntryPoint/EntryPointModel.js';
import EntryPointView from './EntryPoint/EntryPointView.js';
import EntryPointController from './EntryPoint/EntryPointController.js';
import EntryPointTemplate from './EntryPoint/EntryPointTemplate.js';




export default class EntryPoint {
    constructor() {
        const dom = new EntryPointDOM();

        this.model = new EntryPointModel();
        this.view = new EntryPointView(this, dom);
        this.controller = new EntryPointController(this);
        this.template = new EntryPointTemplate();
    }
} 