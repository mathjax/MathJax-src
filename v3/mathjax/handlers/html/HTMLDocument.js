import {Document} from "../../core/Document.js";
import {HTMLMathItem} from "./HTMLMathItem.js";

export class HTMLDocument extends Document {

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
      this.math = [new HTMLMathItem(string,"TeX",display)];
      this.processed.TestMath = true;
    }
    return this;
  }

};

HTMLDocument.type = "HTML";
