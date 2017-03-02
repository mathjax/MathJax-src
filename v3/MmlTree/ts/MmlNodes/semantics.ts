import {PropertyList} from '../Node';
import {AMmlNode} from '../MmlNode';

export class MmlSemantics extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        definitionUrl: null,
        encoding: null
    };

    get kind() {return 'semantics'}
    get notParent() {return true}
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
