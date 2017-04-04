import {InputJax} from "../core/InputJax.js";
import {DefaultOptions,SeparateOptions} from "../util/Options.js";
import {DOMParser} from "../util/document.js";

import {FindMathML} from "./mathml/FindMathML.js";
import {MathMLCompile} from "./mathml/js/MathMLCompile.js";

export class MathML extends InputJax {
  
  constructor(options) {
    let [mml,find,compile] = SeparateOptions(options,FindMathML.OPTIONS,MathMLCompile.OPTIONS);
    super(mml);
    this.processStrings = false;
    this.FindMathML = this.options.FindMathML || new FindMathML(find);
    this.MathML = this.options.MathMLCompile || new MathMLCompile(compile);
    this.parser = this.options.DOMParser || new DOMParser();
  }
  
  Compile(math) {
    let mml = math.start.node;
    if (!mml) {
      let mathml = math.math || '<math></math>';
      let html = this.parser.parseFromString(mathml, "text/html");
      mml = html.body.removeChild(html.body.firstChild);
    }
    return this.MathML.Compile(mml);
  }
  
  FindMath(node) {
    return this.FindMathML.FindMath(node);
  }
  
};

MathML.NAME = "MathML";
MathML.OPTIONS = DefaultOptions({
  FindMathML: null,
  MathMLCompile: null,
  DOMParser: null
},InputJax.OPTIONS);
