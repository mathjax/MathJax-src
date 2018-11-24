import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {SVG} from "mathjax3/output/svg.js";
import {HTMLMathItem} from "mathjax3/handlers/html/HTMLMathItem.js";
import {HTMLDocument} from "mathjax3/handlers/html/HTMLDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

import {ConfigurationHandler} from 'mathjax3/input/tex/Configuration.js';
import 'mathjax3/input/tex/AllPackages.js';

let chtml = new CHTML();
let svg = new SVG();

let docs = {
  CHTML: new HTMLDocument(document, browserAdaptor(), {OutputJax: chtml}),
  SVG:   new HTMLDocument(document, browserAdaptor(), {OutputJax: svg})
};
document.head.appendChild(chtml.styleSheet(docs.CHTML));
document.head.appendChild(svg.styleSheet(docs.SVG));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  renderer: 'CHTML',
  doc: docs.CHTML,
  TeX: null,  
  packages: {},
  
  Typeset() {
    this.output.innerHTML = '';
    let text = this.output.appendChild(document.createTextNode(''));

    let TeX = this.tex.value;
    let math = new HTMLMathItem(TeX, this.TeX, this.display);
    math.setMetrics(...this.metrics);
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.mathItem = math;

    handleRetriesFor(function () {
      math.compile(this.doc);
      math.typeset(this.doc);
      math.updateDocument(this.doc);  
    }.bind(this)).catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = [
      '?',
      this.renderer.charAt(0),
      (this.display ? 1 : 0),
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
  
  newPackages() {
    this.TeX = new TeX({packages: this.getPackages()});
    docs.CHTML = new HTMLDocument(document, browserAdaptor(), {InputJax: this.TeX, OutputJax: chtml});
    docs.SVG = new HTMLDocument(document, browserAdaptor(), {InputJax: this.TeX, OutputJax: svg}); 
    this.doc = docs[this.renderer];
    Lab.Typeset();
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
    const n = Lab.getPackageFlags().length;
    const data = decodeURIComponent(window.location.search.substr(1));
    this.tex.value = data.substr(n + 2).trim();
    this.display = data.charAt(1) === '1';
    this.renderer = {C: 'CHTML', S: 'SVG'}[data.charAt(0)];
    this.doc = docs[this.renderer];
    document.getElementById('renderer').value = this.renderer;
    document.getElementById('display').checked = this.display;
    const flags = data.substr(2,n); 
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
if (window.location.search !== "") Lab.Load();
Lab.newPackages();
