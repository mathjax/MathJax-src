import {PropertyList} from '../Node';
import {AMmlTokenNode, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMi extends AMmlTokenNode {
    static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        mathvariant: DEFAULT.AUTO
    };
    _texClass = TEXCLASS.ORD;

    get kind() {return 'mi'}

    autoDefault(name: string) {
        if (name === "mathvariant") {
            let text = this.getText();
            if (text.length === 1) return "italic";
            return "normal";
        }
        return "";
    }
}
