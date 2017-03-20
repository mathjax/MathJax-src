import {PropertyList} from '../Node';
import {MmlNode, AMmlNode, AMmlBaseNode, IMmlNode} from '../MmlNode';

export class MmlSemantics extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        definitionUrl: null,
        encoding: null
    };

    get kind() {return 'semantics'}
    get notParent() {return true}

    setTeXclass(prev: MmlNode) {
        let child = this.childNodes[0];
        if (child) {
            prev = child.setTeXclass(prev);
            this.updateTeXclass(child);
        }
        return prev;
    }
}

export class MmlAnnotationXML extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        definitionUrl: null,
        encoding: null,
        cd: "mathmlkeys",
        name: "",
        src: null
    };

    get kind() {return 'annotation-xml'}
    get linebreakContainer() {return true}

    protected setChildInheritedAttributes() {}
}

export class MmlAnnotation extends MmlAnnotationXML {
    properties = {
        isChars: true
    }
}
