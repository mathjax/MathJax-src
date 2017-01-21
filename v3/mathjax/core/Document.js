import {UserOptions, DefaultOptions} from "../util/Options.js";
import {InputJax} from "./InputJax.js";
import {OutputJax} from "./OutputJax.js";

export class Document {
  constructor (document,options) {
    this.document = document;
    this.type = this.constructor.type;
    this.options = UserOptions(DefaultOptions({},this.constructor.OPTIONS),options);
    this.math = [];
    this.processed = {
      FindMath: false,
      Compile: false,
      Typeset: false,
      GetMetrics: false,
      AddEventHandlers: false,
      UpdateDocument: false
    };
    this.InputJax = this.options["InputJax"] || new InputJax();
    this.OutputJax = this.options["OutputJax"] || new OutputJax();
    if (!Array.isArray(this.InputJax)) this.InputJax = [this.InputJax];
  }
  
  FindMath(options) {
    this.processed.FindMath = true;
    return this;
  }
  
  Compile(options) {
    if (!this.processed.Compile) {
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].Compile(this);
      }
      this.processed.Compile = true;
    }
    return this;
  }

  Typeset(options) {
    if (!this.processed.Typeset) {
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].Typeset(this);
      }
      this.processed.Typeset = true;
    }
    return this;
  }

  GetMetrics() {
    if (!this.processed.GetMetrics) {
      this.OutputJax.GetMetrics(this);
      this.processed.GetMetrics = true;
    }
    return this;
  }

  AddEventHandlers() {
    this.processed.AddEventHandlers = true;
    return this;
  }

  UpdateDocument() {
    if (!this.processed.UpdateDocument) {
      for (let i = 0, m = this.math.length; i < m; i++) {
        if (this.math[i]) this.math[i].UpdateDocument(this);
      }
      this.processed.UpdateDocument = true;
    }
    return this;
  }
  
  Concat(collection) {
    this.math = this.math.concat(collection.math);
    return this;
  }
  
};

Document.type = "Document";
Document.OPTIONS = {
  OutputJax: null,
  InputJax: null
};

