import {TextNode} from './Node.js';
import {MmlNodeClass, XMLNode} from './MmlNode.js';
import {MmlMath} from './MmlNodes/math.js';
import {MmlMrow,MmlInferredMrow} from './MmlNodes/mrow.js';
import {MmlMi} from './MmlNodes/mi.js';

export let MML: {[kind: string]: MmlNodeClass} = {
    [MmlMath.prototype.kind]: MmlMath,
    [MmlMrow.prototype.kind]: MmlMrow,
    [MmlInferredMrow.prototype.kind]: MmlInferredMrow,
    [MmlMi.prototype.kind]: MmlMi,
    [TextNode.prototype.kind]: TextNode,
    [XMLNode.prototype.kind]: XMLNode
};
