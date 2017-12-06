import {MathML} from "mathjax3/input/MathML.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {AbstractMathItem} from "mathjax3/core/MathItem.js";
import {AbstractMathDocument} from "mathjax3/core/MathDocument.js";
import {DOM} from "mathjax3/util/DOM.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";

let mml = new MathML();
let chtml = new CHTML();

let doc = new AbstractMathDocument(DOM.document,{OutputJax: chtml});

chtml.nodes.document = doc.document;
DOM.document.head.appendChild(chtml.styleSheet(doc));

const Lab = DOM.window.Lab = {
  mml: DOM.document.getElementById('mml'),
  output: DOM.document.getElementById('output'),
  display: true,
  
  Typeset() {
    let MML = this.mml.value;
    let math = new AbstractMathItem(MML,mml);
    math.setMetrics(16,8,1000000,100000,1);
    math.display = this.display;
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(doc);
    }).then(() => Lab.Update(math.typesetRoot.outerHTML))
      .catch(err => console.log("Error: "+err.message));
  },
  
  Keep() {
    DOM.window.location.search = "?" + encodeURIComponent(this.mml.value);
  },
  
  Update(html) {
    this.output.innerHTML = html;
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
  Lab.mml.value = decodeURIComponent(DOM.window.location.search.substr(1));
  Lab.Typeset();
}

