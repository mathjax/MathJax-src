import {Document} from "../../core/Document.js";
import {DefaultOptions} from "../../util/Options.js";
import {HTMLMathItem} from "./HTMLMathItem.js";
import {HTMLMathList} from "./HTMLMathList.js";
import {HTMLDomStrings} from "./HTMLDomStrings.js";

export class HTMLDocument extends Document {
  
  constructor(document,options) {
    super(document,options);
    this.DomStrings = this.options.DomStrings || new HTMLDomStrings();
  }

  FindPosition(N,index,delim,nodes) {
    let list = nodes[N];
    for (let i = 0, m = list.length; i < m; i++) {
      let [node, n] = list[i];
      if (index <= n) {
        return {node:node, n:index, delim:delim};
      } else {
        index -= n;
      }
    }
    return {node:null, n:0, delim:delim};
  }
  
  MathItem(item,jax,nodes) {
    let math = item.math;
    let start = this.FindPosition(item.n, item.start, item.open, nodes);
    let end = this.FindPosition(item.n, item.end, item.close, nodes);
    if (item.open.substr(0,7) === '\\begin{') {
      start.delim = end.delim = '';
      math = item.open + math + item.close;
    }
    return new HTMLMathItem(math, jax, item.display, start, end);
  }
  
  FindMath(options) {
    if (!this.processed.FindMath) {
      let [strings, nodes] = this.DomStrings.Find(this.document.body);
      for (let jax of this.InputJax) {
        let list = new this.options.MathList();
        for (let math of jax.FindMath(strings)) {
          list.push(this.MathItem(math,jax,nodes));
        }
        this.math.merge(list);
      };
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
      this.math.push(new HTMLMathItem(string,this.InputJax[0],display));
      this.processed.TestMath = true;
    }
    return this;
  }

};

HTMLDocument.type = "HTML";
HTMLDocument.OPTIONS = DefaultOptions({
  MathList: HTMLMathList,
  DomStrings: null
},Document.OPTIONS);
