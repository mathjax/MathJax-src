export class InputJax {
  
  constructor(options = {}) {
    this.name = this.constructor.NAME;
    this.options = options;
  }
  
  FindMath(node,options) {
    // should operate on an array of strings, but for now, use DOM node
    return [];
  }
  
  Compile(math,options) {
  }
  
};

InputJax.NAME = "Generic";
