import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, AttributeList, TEXCLASS} from '../MmlNode';

export class MmlMsqrt extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'msqrt'}
    get arity() {return -1}
    get linebreakContainer() {return true}

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

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        this.childNodes[0].setInheritedAttributes(attributes, display, level, true);
    }
}
