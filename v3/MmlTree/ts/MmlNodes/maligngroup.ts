import {PropertyList} from '../Node';
import {AMmlNode, AttributeList} from '../MmlNode';
import {INHERIT} from '../Attributes';

export class MmlMaligngroup extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        groupalign: INHERIT
    };

    get kind() {return 'maligngroup'}
    get isSpacelike() {return true}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }
}
