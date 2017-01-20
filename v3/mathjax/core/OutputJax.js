export class OutputJax {
  
  constructor(options = {}) {
    this.name = this.constructor.NAME;
    this.options = options;
  }
  
  Typeset(math,document,options) {
  }
  
  GetMetrics(document) {
  }
  
  StyleSheet(document) {
  }

};

OutputJax.NAME = "Generic";
