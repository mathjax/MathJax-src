import {NodeFactory} from './NodeFactory.js';
import {MmlNodeClass} from './MmlNode.js';
import {MML} from './MML.js';

export class MmlFactory extends NodeFactory {
    constructor(nodes: {[kind: string]: MmlNodeClass} = MML) {
        super(nodes);
    }
    get MML() {return this.node}
}
