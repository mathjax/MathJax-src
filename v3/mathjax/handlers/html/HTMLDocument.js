import {Document} from "../../core/Document.js";
import {HTMLMathItem} from "./HTMLMathItem.js";
import {FindMath} from "../../input/legacy/tex2jax.js";
import {CHTMLStyleSheet} from "../../output/legacy/CommonHTML.js";

export class HTMLDocument extends Document {
  constructor (document,options) {
    super(document,"HTML",options);
  }
  
  FindMath(options) {
    if (!this.processed.FindMath) {
      this.math = FindMath(this.document.body);
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
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].Typeset(this);
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
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].UpdateDocument(this);
      }
      let sheet = this.DocumentStyleSheet();
      let styles = this.document.getElementById(sheet.id);
      if (styles) {
        styles.parentNode.replaceChild(sheet,styles);
      } else {
        this.document.head.appendChild(sheet);
      }
      this.processed.UpdateDocument = true;
    }
    return this;
  }
  
  DocumentStyleSheet() {
    return CHTMLStyleSheet(this);
  }
  
  TestMath(string,display=true) {
    if (!this.processed.TestMath) {
      this.math = [new HTMLMathItem(string,"TeX",display)];
      this.processed.TestMath = true;
    }
    return this;
  }

};
