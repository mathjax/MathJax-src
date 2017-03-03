import {Document} from "../../core/Document.js";
import {DefaultOptions, UserOptions} from "../../util/Options.js";
import {HTMLMathItem} from "./HTMLMathItem.js";
import {HTMLMathList} from "./HTMLMathList.js";
import {HTMLDomStrings} from "./HTMLDomStrings.js";

export class HTMLDocument extends Document {
  
  constructor(document,options) {
    super(document,options);
    this.DomStrings = this.options.DomStrings || new HTMLDomStrings();
  }

  FindPosition(N,index,delim,nodes) {
    for (const list of nodes[N]) {
      let [node, n] = list;
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
    return new HTMLMathItem(math, jax, item.display, start, end);
  }
  
  getElements(nodes,document) {
    let containers = [];
    for (const node of nodes) {
      if (typeof(node) === 'string') {
        containers = containers.concat(Array.from(document.querySelectorAll(node)));
      } else if (Array.isArray(node)) {
        containers = containers.concat(node);
      } else {
        containers.push(node);
      }
    }
    return containers;
  }
  
  FindMath(options) {
    options = UserOptions({elements:[this.document.body]},options);
    if (!this.processed.FindMath) {
      for (const container of this.getElements(options.elements,this.document)) {
        let [strings, nodes] = this.DomStrings.Find(container);
        for (const jax of this.InputJax) {
          let list = new this.options.MathList();
          if (jax.processStrings) {
            for (const math of jax.FindMath(strings)) {
              list.push(this.MathItem(math,jax,nodes));
            }
          } else {
            for (const math of jax.FindMath(this.document.body)) {
              let item = new HTMLMathItem(math.math,jax,math.display,math.start,math.end);
              list.push(item);
            }
          }
          this.math.merge(list);
        }
      }
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

  RemoveFromDocument(restore = false) {
    if (this.processed.UpdateDocument) {
      for (const math of this.math) {
        if (math.State() >= STATE.INSERTED) {
          math.State(STATE.TYPESET,restore);
        }
      }
    }
    this.processed.UpdateDocument = false;
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
let STATE = HTMLDocument.STATE = Document.STATE;
