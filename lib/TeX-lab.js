import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {HTMLMathItem} from "mathjax3/handlers/html/HTMLMathItem.js";
import {HTMLDocument} from "mathjax3/handlers/html/HTMLDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

let tex = new TeX();
let chtml = new CHTML();

let doc = new HTMLDocument(document, browserAdaptor(), {InputJax: tex, OutputJax: chtml});
document.head.appendChild(chtml.styleSheet(doc));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  
  Typeset() {
    this.output.innerHTML = '';
    let text = this.output.appendChild(document.createTextNode(''));

    let TeX = this.tex.value;
    let math = new HTMLMathItem(TeX,tex);
    math.setMetrics(16,8,16*20,100000,1);
    math.display = this.display;
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(doc);
      math.updateDocument(doc);  
    }).catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = "?" + (this.display ? 1 : 0) + encodeURIComponent(this.tex.value);
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
  Lab.Typeset();
}

