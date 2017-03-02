import {PropertyList} from '../Node';
import {AMmlNode, AttributeList} from '../MmlNode';

export class MmlMfrac extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        linethickness: 'medium',
        numalign: 'center',
        denomalign: 'center',
        bevelled: false
    };
    get kind() {return 'mfrac'}
    get arity() {return 2}
    get linebreakContainer() {return true}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        if (!display || level > 0) level++;
        (this.childNodes[0] as AMmlNode).setInheritedAttributes(attributes, false, level, prime);
        (this.childNodes[1] as AMmlNode).setInheritedAttributes(attributes, false, level, true);
    }
}
