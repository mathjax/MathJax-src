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
  
  Typeset(options) {}
  
  addEventHandlers() {}
  
};

let STATE = HTMLMathItem.STATE = MathItem.STATE;
