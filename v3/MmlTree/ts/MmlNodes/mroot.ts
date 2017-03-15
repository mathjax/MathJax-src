import {PropertyList} from '../Node';
import {AMmlNode, AttributeList, TEXCLASS} from '../MmlNode';

export class MmlMroot extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    texClass = TEXCLASS.ORD;

    get kind() {return 'mroot'}
    get arity() {return 2}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        this.childNodes[0].setInheritedAttributes(attributes, display, level, true);
        this.childNodes[1].setInheritedAttributes(attributes, false, level + 2, prime);
    }
}
