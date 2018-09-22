import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
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
import 'mathjax3/input/tex/bussproofs/BussproofsConfiguration.js';


let tex = new TeX();
let chtml = new CHTML();

let doc = new HTMLDocument(document, browserAdaptor(), {InputJax: tex, OutputJax: chtml});
document.head.appendChild(chtml.styleSheet(doc));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  packages: {},
  
  Typeset() {
    this.output.innerHTML = '';
    let tex = new TeX({packages: this.getPackages()});
    let text = this.output.appendChild(document.createTextNode(''));

    let value = this.tex.value;
    let math = new HTMLMathItem(value, tex);
    math.setMetrics(16,8,16*20,100000,1);
    math.display = this.display;
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(doc);
    }).then(() => Lab.Update(math.typesetRoot.outerHTML))
      .catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = "?" + [
      (this.display ? 1 : 0) + encodeURIComponent(this.tex.value)].
      concat(this.getPackages()).join(';');
  },
  
  Update(html) {
    this.output.innerHTML = html;
  },

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
  
  checkKey: function (textarea, event) {
    if (!event) event = window.event;
    var code = event.which || event.keyCode;
    if ((event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) &&
        (code === 13 || code === 10)) {
      if (event.preventDefault) event.preventDefault();
      event.returnValue = false;
      this.Typeset();
    }
  }

}

Lab.Packages();
if (window.location.search !== "") {
  let [expr, ...rest] = decodeURIComponent(window.location.search).split(';');
  Lab.tex.value = expr.substr(2); // decodeURIComponent(expr.substr(2));
  Lab.display = expr.substr(1,1) === '1';
  document.getElementById('display').checked = Lab.display;
  Lab.setPackages(rest);
  Lab.Typeset();
}

