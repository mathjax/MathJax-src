import {PropertyList} from '../Node';
import {AMmlLayoutNode, TEXCLASS} from '../MmlNode';

export class MmlMphantom extends AMmlLayoutNode {
    static defaults: PropertyList = {
        ...AMmlLayoutNode.defaults
    };
    protected properties: PropertyList = {
        texClass: TEXCLASS.ORD
    }
    get kind() {return 'mphantom'}
    get arity() {return -1}
}
