import {AbstractInputJax} from "../core/InputJax.js";
import {LegacyAsciiMath} from "../../mathjax2/input/AsciiMath.js";
import {SeparateOptions, OptionList} from "../util/Options.js";
import {MathItem, ProtoItem} from '../core/MathItem.js';

import {FindAsciiMath} from "./asciimath/FindAsciiMath.js";

export class AsciiMath extends AbstractInputJax {

    public static NAME: string = "AsciiMath";
    public static OPTIONS: OptionList = {
        ...AbstractInputJax.OPTIONS,
        FindAsciiMath: null
    };

    protected FindAsciiMath: FindAsciiMath;

    constructor(options: OptionList) {
        let [am, find] = SeparateOptions(options, FindAsciiMath.OPTIONS);
        super(am);
        this.FindAsciiMath = this.options['FindAsciiMath'] || new FindAsciiMath(find);
    }

    Compile(math: MathItem) {
        return LegacyAsciiMath.Compile(math.math, math.display);
    }

    FindMath(strings: string[]) {
        return this.FindAsciiMath.FindMath(strings);
    }

};
