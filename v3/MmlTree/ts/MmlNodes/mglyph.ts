import {PropertyList} from '../Node';
import {AMmlTokenNode, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMi extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        alt: '',
        src: '',
        width: 'auto',
        height: 'auto',
        valign: '0em'
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'mglyph'}
}
