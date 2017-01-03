import {MathItem} from "../../core/MathItem.js";
import {Compile} from "../../input/legacy/TeX.js";

export class HTMLMathItem extends MathItem {
  
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
