import {PropertyList} from '../Node';
import {AMmlTokenNode, AMmlNode, AttributeList, TEXCLASS} from '../MmlNode';

export class MmlMi extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    static namePattern: RegExp = /^[a-z][a-z0-9]*$/i;
    texClass = TEXCLASS.ORD;

    get kind() {return 'mi'}

    setInheritedAttributes(attributes: AttributeList = {},
                           display: boolean = false, level: number = 0, prime: boolean = false) {
        super.setInheritedAttributes(attributes, display, level, prime);
        let text = this.getText();
        if (text.match(/^[\uD800-\uDBFF]?.$/)) {
            this.attributes.setInherited('mathvariant','italic');
        }
    }
    setTeXclass(prev: AMmlNode) {
        this.getPrevClass(prev);
        let name = this.getText();
        if (name.length > 1 && MmlMi.namePattern.exec(name) && this.texClass === TEXCLASS.ORD) {
            this.texClass = TEXCLASS.OP;
            this.setProperty('autoOP', true);
        }
        return this;
    }
}
