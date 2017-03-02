import {PropertyList} from '../Node';
import {AMmlNode, TEXCLASS} from '../MmlNode';

export class MmlMerror extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'merror'}
    get arity() {return -1}
    get linebreakContainer() {return true}
}
