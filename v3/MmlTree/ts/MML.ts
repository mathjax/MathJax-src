import {IMmlNodeClass} from './MmlNode.js';
import {MmlMath} from './nodes/math.js';
import {MmlMrow} from './nodes/mrow.js';
import {MmlMi} from './nodes/mi.js';

export let MML: {[kind: string]: IMmlNodeClass} = {
    math: MmlMath,
    mrow: MmlMrow,
    mi: MmlMi
};
