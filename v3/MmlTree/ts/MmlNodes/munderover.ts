import {PropertyList} from '../Node';
import {AMmlBaseNode, AttributeList} from '../MmlNode';

export class MmlMunderover extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        accent: false,
        accentunder: false,
        align: 'center'
    };
    protected static ACCENTS = ['', 'accentunder', 'accent'];

    get kind() {return 'munderover'}
    get arity() {return 3}
    get base() {return 0}
    get under() {return 1}
    get over() {return 2}
    get linebreakContainer() {return true}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        let nodes = this.childNodes;
        nodes[0].setInheritedAttributes(attributes, display, level, prime || !!nodes[this.over]);
        let force = !!(!display && nodes[0].coreMO().attributes.get('movablelimits'));
        nodes[1].setInheritedAttributes(attributes, display, this.getScriptlevel(1, force, level), prime);
        let ACCENTS = (this.constructor as typeof MmlMunderover).ACCENTS;
        this.setInheritedAccent(1, ACCENTS[1], display, level, prime, force);
        if (!nodes[2]) return;
        nodes[2].setInheritedAttributes(attributes, display, this.getScriptlevel(2, force, level), prime);
        this.setInheritedAccent(2, ACCENTS[2], display, level, prime, force);
    }
    protected getScriptlevel(n: number, force: boolean, level: number) {
        let attributes = this.attributes;
        if (n === this.under && (force || !attributes.get('accentunder'))) return level + 1;
        if (n === this.over  && (force || !attributes.get('accent'))) return level + 1;
        return level;
    }
    protected setInheritedAccent(n: number, accent: string, display: boolean, level: number, prime: boolean, force: boolean) {
        let node = this.childNodes[n];
        if (this.attributes.getExplicit(accent) == null && node.isEmbellished) {
            let value = node.coreMO().attributes.get(accent);
            this.attributes.setInherited(accent,value);
            if (value !== this.attributes.getDefault(accent)) {
                node.setInheritedAttributes({}, display, this.getScriptlevel(n, force, level), prime);
            }
        }
    }
}

export class MmlMunder extends MmlMunderover {
    static defaults: PropertyList = {
        ...MmlMunderover.defaults
    };
    get kind() {return 'munder'}
    get arity() {return 2}
}

export class MmlMover extends MmlMunderover {
    static defaults: PropertyList = {
        ...MmlMunderover.defaults
    };
    protected static ACCENTS = ['', 'accent', 'accentunder'];

    get kind() {return 'mover'}
    get arity() {return 2}
    get under() {return 2}
    get over() {return 1}
}
