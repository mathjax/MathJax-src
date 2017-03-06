import {PropertyList} from '../Node';
import {AMmlNode, AttributeList, TEXCLASS} from '../MmlNode';

export class MmlMsqrt extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'msqrt'}
    get arity() {return -1}
    get linebreakContainer() {return true}

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

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        (this.childNodes[0] as AMmlNode).setInheritedAttributes(attributes, display, level, true);
    }
}
