import {PropertyList} from '../Node';
import {AMmlTokenNode, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMn extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'mn'}
}
