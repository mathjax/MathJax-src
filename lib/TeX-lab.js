import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {AbstractMathItem} from "mathjax3/core/MathItem.js";
import {AbstractMathDocument} from "mathjax3/core/MathDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

import {ConfigurationHandler} from 'mathjax3/input/tex/Configuration.js';

import 'mathjax3/input/tex/base/BaseConfiguration.js';
import 'mathjax3/input/tex/ams/AmsConfiguration.js';
import 'mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import 'mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax3/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax3/input/tex/mhchem/MhchemConfiguration.js';

class LabMathItem extends AbstractMathItem {};
class LabMathDocument extends AbstractMathDocument {};

let tex = new TeX();
let chtml = new CHTML();

let doc = new LabMathDocument(document, browserAdaptor(), {InputJax: tex, OutputJax: chtml});
document.head.appendChild(chtml.styleSheet(doc));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  packages: {},
  
  Typeset() {
    let tex = new TeX({packages: this.getPackages()});
    let LaTeX = this.tex.value;
    let math = new LabMathItem(LaTeX,tex);
    math.setMetrics(16,8,16*20,100000,1);
    math.display = this.display;
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(doc);
    }).then(() => Lab.Update(math.typesetRoot.outerHTML))
      .catch(err => {console.log("Error: "+err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = "?" + (this.display ? 1 : 0) + encodeURIComponent(this.tex.value);
  },
  
  Update(html) {
    this.output.innerHTML = html;
  },

  getPackages() {
    let result = [];
    for (let key in this.packages) {//  Object.keys(this.packages)) {
      if (document.getElementById(this.packages[key]).checked) {
        result.push(key);
      }
    }
    return result;
  },
  
  Packages() {
    let div = document.getElementById('package');
    ConfigurationHandler.getInstance();
    for (let key of ConfigurationHandler.getInstance().keys()) {
      if (key === 'empty') continue;
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

if (window.location.search !== "") {
  Lab.tex.value = decodeURIComponent(window.location.search.substr(2));
  Lab.display = window.location.search.substr(1,1) === '1';
  document.getElementById('display').checked = Lab.display;
  Lab.Packages();
  Lab.Typeset();
}

