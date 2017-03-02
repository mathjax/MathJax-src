import {PropertyList} from '../Node';
import {AMmlNode, AttributeList, DEFAULT, TEXCLASS} from '../MmlNode';

export class MmlMsubsup extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults,
        subscriptshift: '',
        superscriptshift: ''
    };

    get kind() {return 'msubsup'}
    get arity() {return 3}
    get base() {return 0}
    get sub() {return 1}
    get sup() {return 2}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        let nodes = this.childNodes as AMmlNode[];
        nodes[0].setInheritedAttributes(attributes, display, level, prime);
        nodes[1].setInheritedAttributes(attributes, display, level + 1, prime || this.sub === 1);
        if (!nodes[2]) return;
        nodes[2].setInheritedAttributes(attributes, display, level + 1, prime || this.sub === 2);
    }
}

export class MmlMsub extends MmlMsubsup {
    static defaults: PropertyList = {
        ...MmlMsubsup.defaults
    }
    get kind() {return 'msub'}
    get arity() {return 2}
}

export class MmlMsup extends MmlMsubsup {
    static defaults: PropertyList = {
        ...MmlMsubsup.defaults
    }
    get kind() {return 'msup'}
    get arity() {return 2}
    get sub() {return 2}
    get sup() {return 1}
}

