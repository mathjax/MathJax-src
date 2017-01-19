import {Document} from "../../core/Document.js";
import {HTMLMathItem} from "./HTMLMathItem.js";
import {InputJax} from "../../core/InputJax.js";
import {OutputJax} from "../../core/OutputJax.js";

export class HTMLDocument extends Document {
  constructor (document,options) {
    super(document,"HTML",options);
    this.InputJax = this.options["InputJax"] || new InputJax();
    this.OutputJax = this.options["OutputJax"] || new OutputJax();
    if (!Array.isArray(this.InputJax)) this.InputJax = [this.InputJax];
    this.InputJax.forEach(jax => this.InputJaxMap.set(jax.name,jax));
  }
  
  FindMath(options) {
    if (!this.processed.FindMath) {
      this.InputJax.forEach(jax => {
        this.math = this.math.concat(jax.FindMath(this.document.body));
      });
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
        if (this.math[i]) this.math[i].Typeset(this);
      }
      this.processed.Typeset = true;
    }
    return this;
  }
  
  GetMetrics() {
    if (!this.processed.GetMetrics) {
      this.OutputJax.GetMetrics(this);
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
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].UpdateDocument(this);
      }
      let sheet = this.DocumentStyleSheet();
      if (sheet) {
        let styles = this.document.getElementById(sheet.id);
        if (styles) {
          styles.parentNode.replaceChild(sheet,styles);
        } else {
          this.document.head.appendChild(sheet);
        }
      }
      this.processed.UpdateDocument = true;
    }
    return this;
  }
  
  DocumentStyleSheet() {
    return this.OutputJax.StyleSheet(this);
  }
  
  TestMath(string,display=true) {
    if (!this.processed.TestMath) {
      this.math = [new HTMLMathItem(string,"TeX",display)];
      this.processed.TestMath = true;
    }
    return this;
  }

};
