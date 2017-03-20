import {PropertyList} from '../Node';
import {AMmlTokenNode, TEXCLASS} from '../MmlNode';

export class MmlMtext extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'mtext'}
    get isSpacelike() {return true}
}
