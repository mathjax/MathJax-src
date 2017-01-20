import {UserOptions, DefaultOptions} from '../util/Options.js';

//
//  The default options for InputJax
//  
const OPTIONS = {
  //  (none just yet).
};

export class InputJax {
  
  constructor(options = {}) {
    this.name = this.constructor.NAME;
    this.options = UserOptions(DefaultOptions({},OPTIONS),options);
  }
  
  FindMath(node,options) {
    // should operate on an array of strings, but for now, use DOM node
    return [];
  }
  
  Compile(math,options) {
  }
  
};

InputJax.NAME = "Generic";
