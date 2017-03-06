import {PropertyList} from '../Node';
import {AMmlBaseNode, AMmlNode, TEXCLASS} from '../MmlNode';
import {MmlMo} from './mo';

export class TeXAtom extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'TeXAtom'}
    get arity() {return -1}
    get notParent() {return true}

    setTeXclass(prev: AMmlNode) {
        (this.childNodes[0] as AMmlNode).setTeXclass(null);
        return this.adjustTeXclass(prev);
    }
    adjustTeXclass(prev: AMmlNode) {return prev} // replaced below by mo version
}
TeXAtom.prototype.adjustTeXclass = MmlMo.prototype.adjustTeXclass;

