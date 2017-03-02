import {PropertyList} from '../Node';
import {AMmlNode, DEFAULT} from '../MmlNode';

export class MmlMtd extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
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
