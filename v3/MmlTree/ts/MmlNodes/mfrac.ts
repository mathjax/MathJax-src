import {PropertyList} from '../Node';
import {AMmlNode, AMmlBaseNode, AttributeList} from '../MmlNode';

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
        if (!display || level > 0) level++;
        (this.childNodes[0] as AMmlNode).setInheritedAttributes(attributes, false, level, prime);
        (this.childNodes[1] as AMmlNode).setInheritedAttributes(attributes, false, level, true);
    }
}
