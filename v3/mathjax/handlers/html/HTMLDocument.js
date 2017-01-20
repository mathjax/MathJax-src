import {Document} from "../../core/Document.js";
import {HTMLMathItem} from "./HTMLMathItem.js";

export class HTMLDocument extends Document {

  FindMath(options) {
    if (!this.processed.FindMath) {
      this.InputJax.forEach(jax => {
        this.math = this.math.concat(jax.FindMath(this.document.body));
      });
      this.processed.FindMath = true;
    }
    return this;
  }
  
  UpdateDocument() {
    if (!this.processed.UpdateDocument) {
      super.UpdateDocument();
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
      this.math = [new HTMLMathItem(string,this.InputJax[0],display)];
      this.processed.TestMath = true;
    }
    return this;
  }

};

HTMLDocument.type = "HTML";
