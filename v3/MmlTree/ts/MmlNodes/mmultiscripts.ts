import {PropertyList} from '../Node';
import {AMmlNode, AttributeList} from '../MmlNode';
import {MmlMsubsup} from './msubsup';

export class MmlMmultiscripts extends MmlMsubsup {
    static defaults: PropertyList = {
        ...MmlMsubsup.defaults
    };
    get kind() {return 'mmultiscripts'}
    get arity() {return 1}

    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        let n = 0;
        for (const child of this.childNodes) {
            let primestyle = prime || (n % 2 === 1);
            (child as AMmlNode).setInheritedAttributes(attributes, display, level, primestyle);
            n++;
        }
    }
}

export class MmlMprescripts extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    get kind() {return 'mprescripts'}
    get arity() {return 0}
}

export class MmlNone extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    get kind() {return 'none'}
    get arity() {return 0}
}
