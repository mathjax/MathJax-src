import {Document} from "../../core/Document.js";
import {HTMLMathItem} from "./HTMLMathItem.js";

export class HTMLDocument extends Document {
  constructor (document,options) {
    super(document,"HTML",options);
  }
  
  FindMath(options) {
    if (!this.processed.FindMath) {
      console.log("- FindMath");
      this.processed.FindMath = true;
    }
    return this;
  }
  
  Compile(options) {
    if (!this.processed.Compile) {
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].Compile();
      }
      this.processed.Compile = true;
    }
    return this;
  }
  
  Typeset(options) {
    if (!this.processed.Typeset) {
      if (this.typeset == null) this.typeset = new Array(this.math.length);
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
      this.math = [new HTMLMathItem(string,"LegacyTeX",display)];
      this.processed.TestMath = true;
    }
    return this;
  }

};
