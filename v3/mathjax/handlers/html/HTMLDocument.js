import {Document} from "../../core/Document.js";
import {HTMLMathItem} from "./HTMLMathItem.js";
import {TeX} from "../../input/tex.js";

export class HTMLDocument extends Document {
  constructor (document,options) {
    super(document,"HTML",options);
    this.InputJax = new TeX();         // should be obtained from options
  }
  
  FindMath(options) {
    if (!this.processed.FindMath) {
      this.math = this.InputJax.FindMath(this.document.body);
      this.processed.FindMath = true;
    }
    return this;
  }
  
  Compile(options) {
    if (!this.processed.Compile) {
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].Compile(this);
      }
      this.processed.Compile = true;
    }
    return this;
  }
  
  Typeset(options) {
    if (!this.processed.Typeset) {
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].Typeset();
      }
      this.processed.Typeset = true;
    }
    return this;
  }
  
  GetMetrics() {
    if (!this.processed.GetMetrics) {
      console.log("- GetMetrics");
      this.processed.GetMetrics = true;
    }
    return this;
  }
  
  AddEventHandlers() {
    if (!this.processed.AddEventHandlers) {
      console.log("- AddEventHandlers");
      this.processed.AddEventHandlers = true;
    }
    return this;
  }
  
  UpdateDocument() {
    if (!this.processed.UpdateDocument) {
      console.log("- UpdateDocument");
      this.processed.UpdateDocument = true;
    }
    return this;
  }
  
  TestMath(string,display=true) {
    if (!this.processed.TestMath) {
      this.math = [new HTMLMathItem(string,"TeX",display)];
      this.processed.TestMath = true;
    }
    return this;
  }

};
