import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {AbstractMathItem} from "mathjax3/core/MathItem.js";
import {AbstractMathDocument} from "mathjax3/core/MathDocument.js";
import {DOM} from "mathjax3/util/DOM.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";

let tex = new TeX();
let chtml = new CHTML();

let doc = new AbstractMathDocument(DOM.document,{OutputJax: chtml});

chtml.nodes.document = doc.document;
DOM.document.head.appendChild(chtml.styleSheet(doc));

const Lab = DOM.window.Lab = {
  tex: DOM.document.getElementById('tex'),
  output: DOM.document.getElementById('output'),
  display: true,
  
  Typeset() {
    let TeX = this.tex.value;
    let math = new AbstractMathItem(TeX,tex);
    math.setMetrics(16,8,1000000,100000,1);
    math.display = this.display;
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(doc);
    }).then(() => Lab.Update(math.typesetRoot.outerHTML))
      .catch(err => {console.log("Error: "+err.message); console.log(err.stack)});
  },
  
  Keep() {
    DOM.window.location.search = "?" + (this.display ? 1 : 0) + encodeURIComponent(this.tex.value);
  },
  
  Update(html) {
    this.output.innerHTML = html;
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

if (DOM.window.location.search !== "") {
  Lab.tex.value = decodeURIComponent(DOM.window.location.search.substr(2));
  Lab.display = DOM.window.location.search.substr(1,1) === '1';
  DOM.document.getElementById('display').checked = Lab.display;
  Lab.Typeset();
}

