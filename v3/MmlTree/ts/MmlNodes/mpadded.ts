import {PropertyList} from '../Node';
import {AMmlNode} from '../MmlNode';

export class MmlMpadded extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        width: '',
        height: '',
        depth: '',
        lspace: 0,
        voffset: 0
    };
    get kind() {return 'mpadded'}
    get arity() {return -1}
}
