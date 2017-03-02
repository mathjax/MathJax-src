import {PropertyList} from '../Node';
import {AMmlNode, TEXCLASS} from '../MmlNode';

export class MmlMfenced extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        open: '(',
        close: ')',
        separators: ','
    };
    _texClass = TEXCLASS.OPEN;

    get kind() {return 'mfenced'}
}
