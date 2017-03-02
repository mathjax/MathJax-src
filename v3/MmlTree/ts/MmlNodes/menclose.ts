import {PropertyList} from '../Node';
import {AMmlNode, TEXCLASS} from '../MmlNode';

export class MmlMenclose extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        notation: 'longdiv'
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'menclose'}
    get arity() {return -1}
    get linebreakContininer() {return true}
}
