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
    if (!mml || this.options.forceReparse) {
      let mathml = math.math || '<math></math>';
      let doc = this.parser.parseFromString(mathml, "text/" + this.options.parseAs);
      let err = doc.querySelector('parsererror');
      if (err) {
        this.options.parseError.call(this,err);
      }
      if (doc.body) {
        mml = doc.body.removeChild(html.body.firstChild);
      } else {
        mml = doc.removeChild(doc.firstChild);
      }
    }
    return this.MathML.Compile(mml);
  }
  
  FindMath(node) {
    return this.FindMathML.FindMath(node);
  }
  
  Error(message) {
    throw new Error(message);
  }
  
};

MathML.NAME = "MathML";
MathML.OPTIONS = DefaultOptions({
  parseAs: 'xml',
  forceReparse: false,
  FindMathML: null,
  MathMLCompile: null,
  DOMParser: null,
  parseError: function (node) {this.Error(node.textContent.replace(/\n.*/g,''))}
},InputJax.OPTIONS);
