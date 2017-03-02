import {PropertyList} from '../Node';
import {AMmlTokenNode, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMtext extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'mtext'}
    get isSpacelike() {return true}
}
