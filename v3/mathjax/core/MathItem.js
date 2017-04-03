
export class MathItem {
  constructor (math,jax,display=true,start={i:0, n:0, delim:""},end={i:0, n:0, delim:""}) {
    this.math = math;
    this.inputJax = jax;
    this.display = display;
    this.start = start;
    this.end = end;
    this.root = null;
    this.typeset = null;
    this.state = STATE.UNPROCESSED;
    this.metrics = {};
    this.bbox = {};
    this.inputData = {};
    this.outputData = {};
  }
  
  Compile(document) {
    if (this.State() < STATE.COMPILED) {
      this.root = this.inputJax.Compile(this);
      this.State(STATE.COMPILED);
    }
  }
  
  Typeset(document) {
    if (this.State() < STATE.TYPESET) {
      if (this.display === null) {
        this.typeset = document.OutputJax.Escaped(this,document);
      } else {
        this.typeset = document.OutputJax.Typeset(this,document);
      }
      this.State(STATE.TYPESET);
    }
  }
  
  addEventHandlers() {}
  
  UpdateDocument(document) {}
  RemoveFromDocument(restore = false) {}
  
  setMetrics(em,ex,cwidth,lwidth,scale) {
    this.metrics = {
      em: em, ex: ex,
      containerWidth: cwidth,
      lineWidth: lwidth,
      scale: scale
    }
  }
  
  State(state = null, restore = false) {
    if (state != null) {
      if (state < STATE.INSERTED && this.state >= STATE.INSERTED) {
        this.RemoveFromDocument(restore);
      }
      if (state < STATE.TYPESET && this.state >= STATE.TYPESET) {
        this.bbox = {};
        this.outputData = {};
      }
      if (state < STATE.COMPILED && this.state >= STATE.COMPILED) {
        this.inputData = {};
      }
      this.state = state
    }
    return this.state;
  }
  
};

let STATE = MathItem.STATE = {
  UNPROCESSED: 0,
  COMPILED: 1,
  TYPESET: 2,
  INSERTED: 3
};
