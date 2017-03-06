import {PropertyList} from '../Node';
import {AMmlNode, AMmlBaseNode} from '../MmlNode';

export class MmlSemantics extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        definitionUrl: null,
        encoding: null
    };

    get kind() {return 'semantics'}
    get notParent() {return true}

    setTeXclass(prev: AMmlNode) {
        let child = this.childNodes[0] as AMmlNode;
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
}

export class MmlAnnotation extends MmlAnnotationXML {
    properties = {
        isChars: true
    }
}
