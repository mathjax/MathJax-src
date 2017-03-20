import {PropertyList} from '../Node';
import {AMmlBaseNode, MmlNode} from '../MmlNode';
import {INHERIT} from '../Attributes';

export class MmlMtd extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        rowspan: 1,
        columnspan: 1,
        rowalign: INHERIT,
        columnalign: INHERIT,
        groupalign: INHERIT
    };
    get kind() {return 'mtd'}
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
}
