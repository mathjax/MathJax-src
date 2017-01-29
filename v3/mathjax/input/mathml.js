import {InputJax} from "../core/InputJax.js";
import {LegacyMathML} from "./legacy/MathML.js";
import {DefaultOptions,SeparateOptions} from "../util/Options.js";

import {FindMathML} from "./mathml/FindMathML.js";

export class MathML extends InputJax {
  
  constructor(options) {
    let [mml,find] = SeparateOptions(options,FindMathML.OPTIONS);
    super(mml);
    this.processStrings = false;
    this.FindMathML = this.options.FindMathML || new FindMathML(find);
  }
  
  Compile(mml,display) {
    return LegacyMathML.Compile(mml,display);
  }
  
  Translate(mml,display) {
    return LegacyMathML.Translate(mml,display);
  }
  
  FindMath(node) {
    return this.FindMathML.FindMath(node);
  }
  
};

MathML.NAME = "MathML";
MathML.OPTIONS = DefaultOptions({
  FindMathML: null
},InputJax.OPTIONS);
