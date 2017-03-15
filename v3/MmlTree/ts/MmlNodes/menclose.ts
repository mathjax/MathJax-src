import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, TEXCLASS} from '../MmlNode';

export class MmlMenclose extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        notation: 'longdiv'
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'menclose'}
    get arity() {return -1}
    get linebreakContininer() {return true}

    setTeXclass(prev: MmlNode) {
        this.getPrevClass(prev);
        for (const child of this.childNodes) {
            child.setTeXclass(null);
        }
        if (this.isEmbellished) {
            this.updateTeXclass(this.core());
        }
        return this;
    }
}
