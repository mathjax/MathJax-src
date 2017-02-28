import {IMmlNodeClass} from './MmlNode.js';
import {MmlMath} from './MmlNodes/math.js';
import {MmlMrow} from './MmlNodes/mrow.js';
import {MmlMi} from './MmlNodes/mi.js';

export let MML: {[kind: string]: IMmlNodeClass} = {
    math: MmlMath,
    mrow: MmlMrow,
    mi: MmlMi
};
