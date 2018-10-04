import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {SVG} from '../mathjax3/output/svg.js';
import {HTMLMathItem} from '../mathjax3/handlers/html/HTMLMathItem.js';
import {HTMLDocument} from '../mathjax3/handlers/html/HTMLDocument.js';
import {handleRetriesFor} from '../mathjax3/util/Retries.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';
import {SerializedMmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';

import {ConfigurationHandler} from '../mathjax3/input/tex/Configuration.js';

import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
import '../mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';
import '../mathjax3/input/tex/braket/BraketConfiguration.js';
import '../mathjax3/input/tex/mhchem/MhchemConfiguration.js';
import '../mathjax3/input/tex/physics/PhysicsConfiguration.js';
import '../mathjax3/input/tex/verb/VerbConfiguration.js';
import '../mathjax3/input/tex/cancel/CancelConfiguration.js';
import '../mathjax3/input/tex/enclose/EncloseConfiguration.js';

const jax = {
    TeX: new TeX(),
  CHTML: new CHTML(),
    SVG: new SVG()
};
const docs = {
  CHTML: new HTMLDocument(document, browserAdaptor(), {InputJax: jax.TeX, OutputJax: jax.CHTML}),
    SVG: new HTMLDocument(document, browserAdaptor(), {InputJax: jax.TeX, OutputJax: jax.SVG})
};

const visitor = new SerializedMmlVisitor();
const toMml = (node => visitor.visitTree(node, Lab.doc.document));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  mathml: document.getElementById('mathml'),
  display: true,
  showMML: false,
  packages: {},
  renderer: 'CHTML',
  doc: docs.CHTML,
  jax: jax.CHTML,
  mml: '',
  
  Typeset() {
    this.output.innerHTML = '';
    let text = this.output.appendChild(document.createTextNode(''));
    if (!document.getElementById(this.renderer + '-styles')) {
      document.head.appendChild(this.jax.styleSheet(this.doc));
    }

    let TeX = this.tex.value;
    let math = new HTMLMathItem(TeX, jax.TeX, this.display);
    math.setMetrics(...this.metrics);
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.mathItem = math;

    handleRetriesFor(function () {
      math.compile();
      this.mml = toMml(math.root);
      this.mathml.innerHTML = '';
      if (this.showMML) Lab.mathml.appendChild(document.createTextNode(this.mml));
      math.typeset(this.doc);
      math.updateDocument(this.doc);
    }.bind(this)).catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = [
      '?',
      this.renderer.charAt(0),
      (this.display ? 1 : 0),
      (this.showMML ? 1 : 0),
      this.getPackageFlags(),
      encodeURIComponent(this.tex.value)
    ].join('');
  },

  getPackageFlags() {
    const keys = Object.keys(this.packages);
    return keys.map(key => document.getElementById(this.packages[key]).checked ? 1 : 0).join('');
  },

  getPackages() {
    let result = [];
    for (let key in this.packages) {
      if (document.getElementById(this.packages[key]).checked) {
        result.push(key);
      }
    }
    return result;
  },
  
  Packages() {
    let div = document.getElementById('package');
    for (let key of ConfigurationHandler.keys()) {
      if (key === 'empty' || key === 'extension') continue;
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = key;
      checkbox.value = key;
      checkbox.id = 'package-' + key;
      checkbox.onchange = function () {Lab.newPackages()};
      if (key === 'base') checkbox.checked = true;
      let label = document.createElement('label');
      label.htmlFor = 'package-' + key;
      label.appendChild(document.createTextNode(key[0].toUpperCase() + key.slice(1)));
      checkbox.appendChild(label);
      div.appendChild(checkbox);
      div.appendChild(label);
      this.packages[key] = 'package-' + key;
    }
  },

  newPackages() {
    jax.TeX = new TeX({packages: this.getPackages()});
    docs.CHTML.inputJax = [jax.TeX];
    docs.SVG.inputJax = [jax.TeX];
    this.doc = docs[this.renderer];
    jax.TeX.setAdaptor(this.doc.adaptor);
    Lab.Typeset();
  },
  
  sendToMathML() {
    window.location = 'MML-Lab.html?' + this.renderer.charAt(0) + encodeURIComponent(this.mml);
  },
  
  setDisplay(checked) {
    this.display = checked;
    this.Typeset();
  },
  
  setRenderer(value) {
    this.renderer = value;
    this.doc = docs[value];
    this.jax = jax[value];
    this.Typeset();
  },
  
  setMathML(checked) {
    this.showMML = checked;
    this.Typeset();
  },
  
  checkKey(textarea, event) {
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
    const data = decodeURIComponent(window.location.search.substr(1));
    const n = Lab.getPackageFlags().length;
    this.tex.value = data.substr(n + 3).trim();
    this.showMML = data.charAt(2) === '1';
    this.display = data.charAt(1) === '1';
    this.renderer = {C: 'CHTML', S: 'SVG'}[data.charAt(0)];
    this.doc = docs[this.renderer];
    this.jax = jax[this.renderer];
    document.getElementById('renderer').value = this.renderer;
    document.getElementById('display').checked = this.display;
    document.getElementById('showMML').checked = this.showMML;
    const flags = data.substr(3,n); 
    let i = 0;
    for (const key in Lab.packages) {
      if (flags.charAt(i++) === '1') {
        document.getElementById(Lab.packages[key]).checked = true;
      }
    }
  }

}

Lab.Packages();
Lab.Init();
if (window.location.search !== '') Lab.Load();
Lab.newPackages();
