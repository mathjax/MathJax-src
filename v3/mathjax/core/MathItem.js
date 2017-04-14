
export class MathItem {
  constructor (math,jax,display=true,start={i:0, n:0, delim:""},end={i:0, n:0, delim:""}) {
    this.math = math;
    this.inputJax = jax;
    this.display = display;
    this.start = start;
    this.end = end;
    this.tree = null;
    this.typeset = null;
    this.state = STATE.UNPROCESSED;
    this.metrics = {};
    this.bbox = {};
    this.inputData = {};
    this.outputData = {};
  }
  
  Compile(document,options) {
    if (this.State() < STATE.COMPILED) {
      this.tree = this.inputJax.Compile(this.math,this.display);
      this.State(STATE.COMPILED);
    }
  }
  
  Typeset(document,options) {
    if (this.State() < STATE.TYPESET) {
      this.typeset = document.OutputJax.Typeset(this,document);
      this.State(STATE.TYPESET);
    }
  }
  
  addEventHandlers() {}
  
  UpdateDocument(document,options) {}
  
  setMetrics(em,ex,cwidth,lwidth,scale) {
    this.metrics = {
      em: em, ex: ex,
      containerWidth: cwidth,
      lineWidth: lwidth,
      scale: scale
    }
  }
  
  State(state=null) {
    if (state != null) this.state = state;
    return this.state;
  }
  
};

let STATE = MathItem.STATE = {
  UNPROCESSED: 0,
  COMPILED: 1,
  TYPESET: 2,
  INSERTED: 3
};
