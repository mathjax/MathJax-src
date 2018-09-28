import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {SVG} from "mathjax3/output/svg.js";
import {HTMLMathItem} from "mathjax3/handlers/html/HTMLMathItem.js";
import {HTMLDocument} from "mathjax3/handlers/html/HTMLDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

import {ConfigurationHandler} from 'mathjax3/input/tex/Configuration.js';

import 'mathjax3/input/tex/base/BaseConfiguration.js';
import 'mathjax3/input/tex/ams/AmsConfiguration.js';
import 'mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import 'mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax3/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax3/input/tex/braket/BraketConfiguration.js';
import 'mathjax3/input/tex/mhchem/MhchemConfiguration.js';


let tex = new TeX();
let chtml = new CHTML();
let svg = new SVG();

let docs = {
  CHTML: new HTMLDocument(document, browserAdaptor(), {InputJax: tex, OutputJax: chtml}),
  SVG:   new HTMLDocument(document, browserAdaptor(), {InputJax: tex, OutputJax: svg})
};
document.head.appendChild(chtml.styleSheet(docs.CHTML));
document.head.appendChild(svg.styleSheet(docs.SVG));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  renderer: 'CHTML',
  doc: docs.CHTML,
  packages: {},
  
  Typeset() {
    this.output.innerHTML = '';
    let tex = new TeX({packages: this.getPackages()});
    let text = this.output.appendChild(document.createTextNode(''));

    let TeX = this.tex.value;
    let math = new HTMLMathItem(TeX,tex);
    math.setMetrics(...this.metrics);
    math.display = this.display;
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(Lab.doc);
      math.updateDocument(Lab.doc);  
    }).catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = [[
      "?",
      this.renderer.charAt(0),
      (this.display ? 1 : 0),
      encodeURIComponent(this.tex.value)
    ].join('')].concat(this.getPackages()).join(';');

  setPackages(packages) {
    for (let pack of packages) {
      let node = document.getElementById('package-' + pack);
      if (node) {
        node.checked = true;
      }
    }
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
      checkbox.type = "checkbox";
      checkbox.name = key;
      checkbox.value = key;
      checkbox.id = 'package-' + key;
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
  
  setDisplay(checked) {
    this.display = checked;
    this.Typeset();
  },
  
  setRenderer(value) {
    this.renderer = value;
    this.doc = docs[value];
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
    let test = chtml.getTestElement(this.output);
    let {em, ex, containerWidth, lineWidth, scale} = chtml.measureMetrics(test);
    this.metrics = [em, ex, containerWidth, lineWidth, scale];
    this.output.removeChild(test);
  },
  
  Load() {
    const [data, ...rest] = decodeURIComponent(window.location.search.substr(1)).split(';');
    this.tex.value = decodeURIComponent(data.substr(2)).trim();
    this.display = data.charAt(1) === '1';
    this.renderer = {C: 'CHTML', S: 'SVG'}[data.charAt(0)];
    this.doc = docs[this.renderer];
    document.getElementById('renderer').value = this.renderer;
    document.getElementById('display').checked = this.display;
    Lab.setPackages(rest);
    this.Typeset();
  }

}

Lab.Packages();
Lab.Init();
if (window.location.search !== "") Lab.Load();
