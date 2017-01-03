
export class MathItem {
  constructor (math,format,display=true,start={i:0, n:0, delim:""},end={i:0, n:0, delim:""}) {
    this.math = math;
    this.format = format;
    this.display = true;
    this.start = start;
    this.end = start;
    this.tree = null;
    this.typeset = null;
    this.state = STATE.UNPROCESSED;
    this.metrics = {};
    this.bbox = {};
    this.inputData = {};
    this.outputData = {};
  }
  
  Compile(options) {}
  Typeset(options) {}
  
  addEventHandlers() {}

  setMetrics(em,ex,cwidth,lwidth,scale) {
    this.metrics = {
      em: em, ex:ex,
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
  TYPESET: 2
};
