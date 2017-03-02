import {PropertyList} from '../Node';
import {AMmlNode, AttributeList, DEFAULT} from '../MmlNode';

export class MmlMaligngroup extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        groupalign: DEFAULT.INHERIT
    };

    get kind() {return 'maligngroup'}
    get isSpacelike() {return true}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        attributes = this.addInheritedAttributes(attributes, this.getAttributes());
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }
}
