import {PropertyList} from '../Node';
import {AMmlTokenNode, AMmlNode, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMi extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        mathvariant: DEFAULT.AUTO
    };
    static namePattern: RegExp = /^[a-z][a-z0-9]*$/i;
    texClass = TEXCLASS.ORD;

    get kind() {return 'mi'}

    autoDefault(name: string) {
        if (name === "mathvariant") {
            let text = this.getText();
            if (text.length === 1) return "italic";
            return "normal";
        }
        return "";
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
