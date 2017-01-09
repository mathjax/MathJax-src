import {MathItem} from "../../core/MathItem.js";
import {Compile} from "../../input/legacy/TeX.js";

export class HTMLMathItem extends MathItem {
  
  constructor(math,format,display=true,
             start={node:null, n:0, delim:""},end={node:null, n:0, delim:""}) {
    super(math,format,display,start,end);
  }
  
  Compile(options) {
    if (this.State() < STATE.COMPILED) {
      this.tree = Compile(this.math,this.display);
      this.State(STATE.COMPILED);
    }
  }
  
  Typeset(options) {}
  
  addEventHandlers() {}
  
};

let STATE = HTMLMathItem.STATE = MathItem.STATE;
