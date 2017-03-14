import {PropertyList} from '../Node';
import {AMmlNode, AMmlBaseNode, AttributeList, DEFAULT} from '../MmlNode';

export class MmlMunderover extends AMmlBaseNode {
    static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        accent: DEFAULT.AUTO,
        accentunder: DEFAULT.AUTO,
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
        let nodes = this.childNodes as AMmlNode[];
        let force = !!(!display && ((this.childNodes[0] as AMmlNode).coreMO() as AMmlNode).attributes.get('movablelimits'));
        nodes[0].setInheritedAttributes(attributes, display, level, prime || !!this.childNodes[this.over]);
        nodes[1].setInheritedAttributes(attributes, display, this.getScriptlevel(1, force, level), prime);
        if (!nodes[2]) return;
        nodes[2].setInheritedAttributes(attributes, display, this.getScriptlevel(2, force, level), prime);
    }
    protected getScriptlevel(n: number, force: boolean, level: number) {
        let attributes = this.attributes;
        if (n === this.under && (force || !attributes.get('accentunder'))) return level + 1;
        if (n === this.over  && (force || !attributes.get('accent'))) return level + 1;
        return level;
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
