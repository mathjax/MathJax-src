import {PropertyList} from '../Node';
import {AMmlLayoutNode} from '../MmlNode';

export class MmlMpadded extends AMmlLayoutNode {
    static defaults: PropertyList = {
        ...AMmlLayoutNode.defaults,
        width: '',
        height: '',
        depth: '',
        lspace: 0,
        voffset: 0
    };

    get kind() {return 'mpadded'}
}
