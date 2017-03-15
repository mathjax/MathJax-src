import {PropertyList} from '../Node';
import {AMmlBaseNode, MmlNode, IMmlNode, TEXCLASS} from '../MmlNode';
import {MmlMo} from './mo';

export class TeXAtom extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'TeXAtom'}
    get arity() {return -1}
    get notParent() {return true}

    setTeXclass(prev: MmlNode) {
        this.childNodes[0].setTeXclass(null);
        return this.adjustTeXclass(prev);
    }
    adjustTeXclass(prev: MmlNode) {return prev} // replaced below by mo version
}
TeXAtom.prototype.adjustTeXclass = MmlMo.prototype.adjustTeXclass;

