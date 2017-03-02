import {PropertyList} from '../Node';
import {AMmlNode, AttributeList, DEFAULT} from '../MmlNode';

export class MmlMstyle extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        scriptlevel: DEFAULT.INHERIT,
        displaystyle: DEFAULT.INHERIT,
        scriptsizemultiplier: Math.sqrt(1/2),
        scriptminsize: "8pt",
        mathbackground: DEFAULT.INHERIT,
        mathcolor: DEFAULT.INHERIT,
        dir: DEFAULT.INHERIT,
        infixlinebreakstyle: 'before'
    };

    get kind() {return 'mstyle'}
    get arity() {return -1}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        let scriptlevel = this.getAttribute('scriptlevel');
        if (scriptlevel != null) {
            scriptlevel = scriptlevel.toString();
            if (scriptlevel.match(/^ *[-+]/)) {
                level += parseInt(scriptlevel);
            } else {
                level = parseInt(scriptlevel);
            }
        }
        attributes = this.addInheritedAttributes(attributes, this.getAttributes());
        (this.childNodes[0] as AMmlNode).setInheritedAttributes(attributes, display, level, prime);
    }
}
