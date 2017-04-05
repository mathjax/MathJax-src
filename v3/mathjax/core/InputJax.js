import {UserOptions, DefaultOptions} from '../util/Options.js';
import {FunctionList} from '../util/FunctionList.js';

export class InputJax {
  
  constructor(options = {}) {
    this.name = this.constructor.NAME;
    this.processStrings = true;
    this.options = UserOptions(DefaultOptions({},this.constructor.OPTIONS),options);
    this.preFilters = new FunctionList();
    this.postFilters = new FunctionList();
  }
  
  FindMath(node,options) {
    // should operate on an array of strings, but for now, use DOM node
    return [];
  }
  
  Compile(math) {
  }
  
};

InputJax.NAME = "Generic";
InputJax.OPTIONS = {
  //  (none just yet).
};
