import {InputJax} from "../core/InputJax.js";
import {LegacyTeX} from "./legacy/TeX.js";
import {DefaultOptions} from "../util/Options.js";

import {FindTeX} from "./tex/FindTeX.js";

export class TeX extends InputJax {
  
  constructor(options) {
    super(options);
    this.FindTeX = this.options.FindTeX || new FindTeX();
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
