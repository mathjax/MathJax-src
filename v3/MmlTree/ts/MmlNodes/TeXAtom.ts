import {PropertyList} from '../Node';
import {AMmlBaseNode, TEXCLASS} from '../MmlNode';

export class TeXAtom extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'TeXAtom'}
    get arity() {return -1}
    get notParent() {return true}
}
