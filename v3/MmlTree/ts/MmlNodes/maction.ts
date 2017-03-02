import {PropertyList} from '../Node';
import {AMmlNode, MmlNode} from '../MmlNode';

export class MmlMaction extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        actiontype: 'toggle',
        selection: 1
    };

    get kind() {return 'maction'}
    get arity() {return 1}
    get selected(): AMmlNode {return this.childNodes[this.Get("selection") as number] || this.factory.create('mrow')}
    get isEmbellished() {return this.selected.isEmbellished}
    get isSpacelike() {return this.selected.isSpacelike}
    core(): MmlNode {return this.selected.core()}
    coreMO(): MmlNode {return this.selected.coreMO()}
}
