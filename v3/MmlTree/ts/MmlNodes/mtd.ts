import {PropertyList} from '../Node';
import {AMmlBaseNode, AMmlNode} from '../MmlNode';
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
