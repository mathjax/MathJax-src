import {PropertyList} from '../Node';
import {AMmlLayoutNode, TEXCLASS} from '../MmlNode';

export class MmlMphantom extends AMmlLayoutNode {
    static defaults: PropertyList = {
        ...AMmlLayoutNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'mphantom'}
}
