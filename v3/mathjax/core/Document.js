import {UserOptions, DefaultOptions} from "../util/Options.js";
import {InputJax} from "./InputJax.js";
import {OutputJax} from "./OutputJax.js";
import {MathList} from "./MathList.js";
import {MathItem} from "./MathItem.js";

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
  
  Compile() {
    if (!this.processed.Compile) {
      for (const math of this.math) {
        if (math) math.Compile(this);
      }
      this.processed.Compile = true;
    }
    return this;
  }

  Typeset() {
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
  RemoveFromDocument() {
    return this;
  }
  
  State(state,restore = false) {
    for (const math of this.math) {
      math.State(state,restore);
    }
    if (state < STATE.INSERTED) {
      this.processed.UpdateDocument = false;
    }
    if (state < STATE.TYPESET) {
      this.processed.Typeset = false;
      this.processed.AddEventHandlers = false;
      this.processed.GetMetrics = false;
    }
    if (state < STATE.COMPILED) {
      this.processed.Compile = false;
    }
    return this;
  }
  
  Reset() {
    for (const key of Object.keys(this.processed)) {
      this.processed[key] = false;
    }
  }
  
  Clear() {
    this.Reset();
    this.math.Clear();
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
let STATE = Document.STATE = MathItem.STATE;
