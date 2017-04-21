import {UserOptions, DefaultOptions} from '../util/Options.js';

export class OutputJax {
  
  constructor(options = {}) {
    this.name = this.constructor.NAME;
    this.options = UserOptions(DefaultOptions({},this.constructor.OPTIONS),options);
  }
  
  Typeset(math,document) {
  }
  
  Escaped(nath,document) {
  }
  
  GetMetrics(document) {
  }
  
  StyleSheet(document) {
  }

};

OutputJax.NAME = "Generic";
OutputJax.OPTIONS = {
  //  (none just yet).
};
