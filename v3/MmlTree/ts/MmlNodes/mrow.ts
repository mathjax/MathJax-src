import {PropertyList} from '../Node';
import {AMmlNode} from '../MmlNode';

export class MmlMrow extends AMmlNode {
    static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    get kind() {return 'mrow'}
}

export class MmlInferredMrow extends MmlMrow {
    static defaults: PropertyList = MmlMrow.defaults;
    get isInferred() {return true}
}
