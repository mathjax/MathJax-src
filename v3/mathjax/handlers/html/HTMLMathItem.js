import {MathItem} from "../../core/MathItem.js";

export class HTMLMathItem extends MathItem {
  
  constructor(math,jax,display=true,
             start={node:null, n:0, delim:""},
             end={node:null, n:0, delim:""}) {
    super(math,jax,display,start,end);
  }
  
  addEventHandlers() {}
  
  UpdateDocument(html,options) {
    if (this.State() < STATE.INSERTED) {
      var node = this.start.node;
      if (node === this.end.node) {
        if (this.end.n < this.end.node.nodeValue.length) this.end.node.splitText(this.end.n);
        if (this.start.n) node = this.start.node.splitText(this.start.n);
        node.parentNode.replaceChild(this.typeset,node);
      } else {
        if (this.start.n) node = node.splitText(this.start.n);
        while (node !== this.end.node) {
          let next = node.nextSibling;
          node.parentNode.removeChild(node);
          node = next;
        }
        node.parentNode.insertBefore(this.typeset,node);
        if (this.end.n < node.nodeValue.length) {
          node.splitText(this.end.n);
          node.parentNode.removeChild(node);
        }
      }
      this.start.node = this.end.node = this.typeset;
      this.start.n = this.end.n = 0;
      this.State(STATE.INSERTED);
    }
  }
  
};

let STATE = HTMLMathItem.STATE = MathItem.STATE;
