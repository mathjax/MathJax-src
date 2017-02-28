import {TextNode} from './Node.js';
import {MmlNodeClass, XMLNode} from './MmlNode.js';
import {MmlMath} from './MmlNodes/math.js';
import {MmlMrow,MmlInferredMrow} from './MmlNodes/mrow.js';
import {MmlMi} from './MmlNodes/mi.js';

export let MML: {[kind: string]: MmlNodeClass} = {
    math: MmlMath,
    mrow: MmlMrow,
    mi: MmlMi,
    inferredMrow: MmlInferredMrow,
    text: TextNode,
    xml: XMLNode
};
