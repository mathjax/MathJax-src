import {PropertyList} from '../Node';
import {MmlNode, AMmlBaseNode, AttributeList} from '../MmlNode';

export class MmlMfrac extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        linethickness: 'medium',
        numalign: 'center',
        denomalign: 'center',
        bevelled: false
    };
    get kind() {return 'mfrac'}
    get arity() {return 2}
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
        if (!display || level > 0) level++;
        this.childNodes[0].setInheritedAttributes(attributes, false, level, prime);
        this.childNodes[1].setInheritedAttributes(attributes, false, level, true);
    }
}
