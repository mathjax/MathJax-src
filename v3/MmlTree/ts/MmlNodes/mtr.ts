import {PropertyList} from '../Node';
import {AMmlNode, MmlNode, AttributeList, DEFAULT} from '../MmlNode';
import {ANode} from '../Node';

export class MmlMtr extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
      rowalign: DEFAULT.INHERIT,
      columnalign: DEFAULT.INHERIT,
      groupalign: DEFAULT.INHERIT
    };

    get kind() {return 'mtr'}
    get linebreakContainer() {return true}
    //
    // FIXME: Should be in MathML input jax, not here
    //
    appendChild(child: MmlNode) {
        if (!(child instanceof this.factory.getNodeClass('mtd'))) {
            child = this.factory.create('mtd',child);
        }
        return super.appendChild(child);
    }

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        attributes = this.addInheritedAttributes(attributes, this.getAttributes());
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }
}

export class MmlMlabeledtr extends MmlMtr {
    get kind() {return 'mlabeledtr'}
    get arity() {return 1}
}
