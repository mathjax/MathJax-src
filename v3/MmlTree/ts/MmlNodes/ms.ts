import {PropertyList} from '../Node';
import {AMmlTokenNode, TEXCLASS} from '../MmlNode';

export class MmlMs extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        lquote: '"',
        rquote: '"'
    };
    texClass = TEXCLASS.ORD;
    get kind() {return 'ms'}
}
