import {PropertyList} from '../Node';
import {AMmlNode, AMmlLayoutNode, AttributeList} from '../MmlNode';
import {INHERIT} from '../Attributes';

export class MmlMstyle extends AMmlLayoutNode {
    static defaults: PropertyList = {
        ...AMmlLayoutNode.defaults,
        scriptlevel: INHERIT,
        displaystyle: INHERIT,
        scriptsizemultiplier: Math.sqrt(1/2),
        scriptminsize: "8pt",
        mathbackground: INHERIT,
        mathcolor: INHERIT,
        dir: INHERIT,
        infixlinebreakstyle: 'before'
    };

    get kind() {return 'mstyle'}
    get arity() {return -1}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        let scriptlevel = this.attributes.getExplicit('scriptlevel');
        if (scriptlevel != null) {
            scriptlevel = scriptlevel.toString();
            if (scriptlevel.match(/^\s*[-+]/)) {
                level += parseInt(scriptlevel);
            } else {
                level = parseInt(scriptlevel);
            }
        }
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        (this.childNodes[0] as AMmlNode).setInheritedAttributes(attributes, display, level, prime);
    }
}
