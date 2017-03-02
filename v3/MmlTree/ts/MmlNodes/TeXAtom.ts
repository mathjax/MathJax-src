import {PropertyList} from '../Node';
import {AMmlNode, TEXCLASS} from '../MmlNode';

export class TeXAtom extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'TeXAtom'}
    get arity() {return -1}
}
