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
      node.parentNode.insertBefore(this.typeset,node);
      node.parentNode.removeChild(node);
      this.State(STATE.INSERTED);
    }
  }
  
};

let STATE = HTMLMathItem.STATE = MathItem.STATE;
