import {UserOptions, DefaultOptions} from "../util/Options.js";
import {InputJax} from "./InputJax.js";
import {OutputJax} from "./OutputJax.js";

const OPTIONS = {
  OutputJax: null,
  InputJax: null
};

export class Document {
  constructor (document,options) {
    this.document = document;
    this.type = this.constructor.type;
    this.options = UserOptions(DefaultOptions({},OPTIONS),options);
    this.math = [];
    this.processed = {
      FindMath: false,
      Compile: false,
      Typeset: false,
      GetMetrics: false,
      AddEventHandlers: false,
      UpdateDocument: false
    };
    this.InputJaxMap = new Map();
    this.InputJax = this.options["InputJax"] || new InputJax();
    this.OutputJax = this.options["OutputJax"] || new OutputJax();
    if (!Array.isArray(this.InputJax)) this.InputJax = [this.InputJax];
    this.InputJax.forEach(jax => this.InputJaxMap.set(jax.name,jax));
  }
  
  FindMath(options) {
    if (!this.processed.FindMath) {
      this.InputJax.forEach(jax => {
        this.math = this.math.concat(jax.FindMath(this.document.body));
      });
      this.processed.FindMath = true;
    }
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
    if (!this.processed.AddEventHandlers) {
      console.log("- AddEventHandlers");
      this.processed.AddEventHandlers = true;
    }
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
