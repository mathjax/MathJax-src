import {PropertyList} from '../Node';
import {AMmlTokenNode, TEXCLASS} from '../MmlNode';

export class MmlMphantom extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    protected properties: PropertyList = {
        texClass: TEXCLASS.ORD
    }
    get kind() {return 'mphantom'}
    get arity() {return -1}
}
