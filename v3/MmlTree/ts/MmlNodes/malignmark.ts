import {PropertyList} from '../Node';
import {AMmlNode} from '../MmlNode';

export class MmlMalignmark extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        edge: 'left'
    };

    get kind() {return 'malignmark'}
    get arity() {return 0}
    get isSpacelike() {return true}
}
