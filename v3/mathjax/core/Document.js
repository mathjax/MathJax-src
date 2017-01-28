import {UserOptions, DefaultOptions} from "../util/Options.js";
import {InputJax} from "./InputJax.js";
import {OutputJax} from "./OutputJax.js";
import {MathList} from "./MathList.js";

export class Document {
  constructor (document,options) {
    this.document = document;
    this.type = this.constructor.type;
    this.options = UserOptions(DefaultOptions({},this.constructor.OPTIONS),options);
    this.math = new this.options.MathList();
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
      for (const math of this.math) {
        if (math) math.Compile(this);
      }
      this.processed.Compile = true;
    }
    return this;
  }

  Typeset(options) {
    if (!this.processed.Typeset) {
      for (const math of this.math) {
        if (math) math.Typeset(this);
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
      for (const math of this.math.reversed()) {
        math.UpdateDocument(this);
      }
      this.processed.UpdateDocument = true;
    }
    return this;
  }
  
  Concat(collection) {
    this.math.merge(collection.math);
    return this;
  }
  
};

Document.type = "Document";
Document.OPTIONS = {
  OutputJax: null,
  InputJax: null,
  MathList: MathList
};

