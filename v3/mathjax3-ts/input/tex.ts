import {AbstractInputJax} from '../core/InputJax.js';
import {LegacyTeX} from '../../mathjax2/input/TeX.js';
import {SeparateOptions, OptionList} from '../util/Options.js';
import {MathItem, ProtoItem} from '../core/MathItem.js';

import {FindTeX} from './tex/FindTeX.js';

export class TeX extends AbstractInputJax {

    public static NAME: string = 'TeX';
    public static OPTIONS: OptionList = {
        ...AbstractInputJax.OPTIONS,
        FindTeX: null
    };

    protected FindTeX: FindTeX;

    constructor(options: OptionList) {
        let [tex, find] = SeparateOptions(options, FindTeX.OPTIONS);
        super(tex);
        this.FindTeX = this.options['FindTeX'] || new FindTeX(find);
    }

    public Compile(math: MathItem) {
        return LegacyTeX.Compile(math.math, math.display);
    }

    public FindMath(strings: string[]) {
        return this.FindTeX.FindMath(strings);
    }

};
