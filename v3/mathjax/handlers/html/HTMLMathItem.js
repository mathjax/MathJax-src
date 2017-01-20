import {MathItem} from "../../core/MathItem.js";

export class HTMLMathItem extends MathItem {
  
  constructor(math,format,display=true,
             start={node:null, n:0, delim:""},end={node:null, n:0, delim:""}) {
    super(math,format,display,start,end);
  }
  
  Compile(html,options) {
    if (this.State() < STATE.COMPILED) {
      this.tree = html.InputJax.Compile(this.math,this.display);
      this.State(STATE.COMPILED);
    }
  }
  
  Typeset(html,options) {
    if (this.State() < STATE.TYPESET) {
      this.typeset = html.OutputJax.Typeset(this,html);
      this.State(STATE.TYPESET);
    }
  }
  
  addEventHandlers() {}
  
  UpdateDocument(html,options) {
    if (this.State() < STATE.INSERTED) {
      var node = this.start.node;
      node.parentNode.insertBefore(this.typeset,node);
      node.parentNode.removeChild(node);
      this.State(STATE.INSERTED);
    }
  }
  
};

let STATE = HTMLMathItem.STATE = MathItem.STATE;
