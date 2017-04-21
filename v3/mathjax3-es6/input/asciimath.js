import {InputJax} from "../core/InputJax.js";
import {LegacyAsciiMath} from "./legacy/AsciiMath.js";
import {DefaultOptions,SeparateOptions} from "../util/Options.js";

import {FindAsciiMath} from "./asciimath/FindAsciiMath.js";

export class AsciiMath extends InputJax {
  
  constructor(options) {
    let [am,find] = SeparateOptions(options,FindAsciiMath.OPTIONS);
    super(am);
    this.FindAsciiMath = this.options.FindAsciiMath || new FindAsciiMath(find);
  }
  
  Compile(am,display) {
    return LegacyAsciiMath.Compile(am,display);
  }
  
  FindMath(strings) {
    return this.FindAsciiMath.FindMath(strings);
  }
  
};

AsciiMath.NAME = "AsciiMath";
AsciiMath.OPTIONS = DefaultOptions({
  FindAsciiMath: null
},InputJax.OPTIONS);
