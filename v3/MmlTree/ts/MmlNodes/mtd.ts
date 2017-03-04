import {PropertyList} from '../Node';
import {AMmlBaseNode, DEFAULT} from '../MmlNode';

export class MmlMtd extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        rowspan: 1,
        columnspan: 1,
        rowalign: DEFAULT.INHERIT,
        columnalign: DEFAULT.INHERIT,
        groupalign: DEFAULT.INHERIT
    };
    get kind() {return 'mtd'}
    get arity() {return -1}
    get linebreakContainer() {return true}
}
