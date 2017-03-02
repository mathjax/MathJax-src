import {PropertyList} from '../Node';
import {AMmlNode, AttributeList, TEXCLASS} from '../MmlNode';

export class MmlMsqrt extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'msqrt'}
    get arity() {return -1}
    get linebreakContainer() {return true}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        (this.childNodes[0] as AMmlNode).setInheritedAttributes(attributes, display, level, true);
    }
}
