
export class Document {
  constructor (document,type,options) {
    this.document = document;
    this.type = type;
    this.options = options;
    this.math = [];
    this.processed = {
      FindMath: false,
      Compile: false,
      Typeset: false,
      GetMetrics: false,
      AddEventHandlers: false,
      UpdateDocument: false
    };
  }
  
  FindMath(options) {
    this.processed.FindMath = true;
    return this;
  }
  Compile(options) {
    this.processed.Compile = true;
    return this;
  }
  Typeset(options) {
    this.processed.Typeset = true;
    return this;
  }
  GetMetrics() {
    this.process.GetMetrics = true;
    return this;
  }
  AddEventHandlers() {
    this.process.AddEventHandlers = true;
    return this;
  }
  UpdateDocument() {
    this.processed.UpdateDocument = true;
    return this;
  }
  
  Concat(collection) {
    this.math = this.math.concat(collection.math);
    return this;
  }
  
};
