import {UserOptions, DefaultOptions} from '../util/Options.js';

//
//  The default options for OutputJax
//  
const OPTIONS = {
  //  (none just yet).
};

export class OutputJax {
  
  constructor(options = {}) {
    this.name = this.constructor.NAME;
    this.options = UserOptions(DefaultOptions({},OPTIONS),options);
  }
  
  Typeset(math,document,options) {
  }
  
  GetMetrics(document) {
  }
  
  StyleSheet(document) {
  }

};

OutputJax.NAME = "Generic";
