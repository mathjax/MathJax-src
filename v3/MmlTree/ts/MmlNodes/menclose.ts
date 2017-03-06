import {PropertyList} from '../Node';
import {AMmlNode, TEXCLASS} from '../MmlNode';

export class MmlMenclose extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        notation: 'longdiv'
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'menclose'}
    get arity() {return -1}
    get linebreakContininer() {return true}

    setTeXclass(prev: AMmlNode) {
        this.getPrevClass(prev);
        for (const child of (this.childNodes as AMmlNode[])) {
            child.setTeXclass(null);
        }
        if (this.isEmbellished) {
            this.updateTeXclass(this.core() as AMmlNode);
        }
        return this;
    }
}
