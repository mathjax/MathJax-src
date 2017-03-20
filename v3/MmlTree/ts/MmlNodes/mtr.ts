import {PropertyList, ANode, INode} from '../Node';
import {MmlNode, AMmlNode, AttributeList} from '../MmlNode';
import {INHERIT} from '../Attributes';

export class MmlMtr extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        rowalign: INHERIT,
        columnalign: INHERIT,
        groupalign: INHERIT
    };

    get kind() {return 'mtr'}
    get linebreakContainer() {return true}
    //
    // FIXME: Should be in MathML input jax, not here
    //
    appendChild(child: MmlNode) {
        if (!child.isKind('mtd')) {
            child = this.factory.create('mtd', {}, [child]);
        }
        return super.appendChild(child);
    }

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        super.setChildInheritedAttributes(attributes, display, level, prime);
    }

    setTeXclass(prev: MmlNode) {
        this.getPrevClass(prev);
        for (const child of this.childNodes) {
            child.setTeXclass(null);
        }
        if (this.isEmbellished) {
            this.updateTeXclass(this.core());
        }
        return this;
    }
}

export class MmlMlabeledtr extends MmlMtr {
    get kind() {return 'mlabeledtr'}
    get arity() {return 1}
}
