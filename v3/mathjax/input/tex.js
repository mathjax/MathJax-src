import {InputJax} from "../core/InputJax.js";
import {LegacyTeX} from "./legacy/TeX.js";
import {DefaultOptions,SeparateOptions} from "../util/Options.js";

import {FindTeX} from "./tex/FindTeX.js";

export class TeX extends InputJax {
  
  constructor(options) {
    let [tex,find] = SeparateOptions(options,FindTeX.OPTIONS);
    super(tex);
    this.FindTeX = this.options.FindTeX || new FindTeX(find);
  }
  
  Compile(tex,display) {
    return LegacyTeX.Compile(tex,display);
  }
  
  Translate(tex,display) {
    return LegacyTeX.Translate(tex,display);
  }
  
  FindMath(strings) {
    return this.FindTeX.FindMath(strings);
  }
  
};

TeX.NAME = "TeX";
TeX.OPTIONS = DefaultOptions({
  FindTeX: null
},InputJax.OPTIONS);
