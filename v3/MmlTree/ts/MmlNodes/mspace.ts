import {PropertyList} from '../Node';
import {AMmlTokenNode, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMspace extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        width:  '0em',
        height: '0ex',
        depth:  '0ex',
        linebreak: 'auto'
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'mspace'}
    get isSpacelike() {return true}
    get hasNewline() {
        let attributes = this.attributes;
        return (attributes.getExplicit('width') == null && attributes.getExplicit('height') == null &&
                attributes.getExplicit('depth') == null && attributes.get('linebreak') === 'newline');
    }
}
