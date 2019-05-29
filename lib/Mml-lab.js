import {MathML} from '../mathjax3/input/mathml.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {SVG} from '../mathjax3/output/svg.js';
import {HTMLMathItem} from '../mathjax3/handlers/html/HTMLMathItem.js';
import {HTMLDocument} from '../mathjax3/handlers/html/HTMLDocument.js';
import {handleRetriesFor} from '../mathjax3/util/Retries.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';

const jax = {
    MML: new MathML({forceReparse: true}),
  CHTML: new CHTML(),
    SVG: new SVG()
};

const docs = {
  CHTML: new HTMLDocument(document, browserAdaptor(), {InputJax: jax.MML, OutputJax: jax.CHTML}),
    SVG: new HTMLDocument(document, browserAdaptor(), {InputJax: jax.MML, OutputJax: jax.SVG})
};

const Lab = window.Lab = {
  mml: document.getElementById('mml'),
  output: document.getElementById('output'),
  renderer: 'CHTML',
  doc: docs.CHTML,
  jax: jax.CHTML,
  
  Typeset() {
    this.output.innerHTML = '';
    let text = this.output.appendChild(document.createTextNode(''));

    this.doc.clear();
    let MML = this.mml.value;
    let math = new HTMLMathItem(MML, jax.MML, this.display);
    math.setMetrics(...this.metrics);
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.mathItem = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(this.doc);
      math.updateDocument(this.doc);
      this.doc.updateDocument();  
    }.bind(this)).catch(err => {console.log('Error: ' + err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = [
      '?',
      this.renderer.charAt(0),
      encodeURIComponent(this.mml.value)
    ].join('');
  },
  
  setRenderer(value) {
    this.renderer = value;
    this.doc = docs[value];
    this.jax = jax[value];
    this.Typeset();
  },
  
  checkKey: function (textarea, event) {
    if (!event) event = window.event;
    var code = event.which || event.keyCode;
    if ((event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) &&
        (code === 13 || code === 10)) {
      if (event.preventDefault) event.preventDefault();
      event.returnValue = false;
      this.Typeset();
    }
  },
  
  Init() {
    let test = jax.CHTML.getTestElement(this.output);
    let {em, ex, containerWidth, lineWidth, scale} = jax.CHTML.measureMetrics(test);
    this.metrics = [em, ex, containerWidth, lineWidth, scale];
    this.output.removeChild(test);
  },
  
  Load() {
    const data = window.location.search.substr(1);
    this.mml.value = decodeURIComponent(data.substr(1)).trim();
    this.renderer = {C: 'CHTML', S: 'SVG'}[data.charAt(0)];
    this.doc = docs[this.renderer];
    this.jax = jax[this.renderer];
    document.getElementById('renderer').value = this.renderer;
    this.Typeset();
  }

}

Lab.Init();
if (window.location.search !== '') Lab.Load();
