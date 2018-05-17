import {MathML} from "mathjax3/input/mathml.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {HTMLMathItem} from "mathjax3/handlers/html/HTMLMathItem.js";
import {HTMLDocument} from "mathjax3/handlers/html/HTMLDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

let mml = new MathML({forceReparse: true});
let chtml = new CHTML();

let doc = new HTMLDocument(document, browserAdaptor(), {InputJax: mml, OutputJax: chtml});
document.head.appendChild(chtml.styleSheet(doc));

const Lab = window.Lab = {
  mml: document.getElementById('mml'),
  output: document.getElementById('output'),
  display: true,
  
  Typeset() {
    this.output.innerHTML = '';
    let text = this.output.appendChild(document.createTextNode(''));
        
    let MML = this.mml.value;
    let math = new HTMLMathItem(MML, mml, this.display);
    math.setMetrics(16,8,16*20,100000,1);
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.typeset(doc);
      math.updateDocument(doc);  
    }).catch(err => {console.log("Error: "+err.message); console.log(err.stack)});
  },
  
  Keep() {
    window.location.search = "?" + encodeURIComponent(this.mml.value);
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
  Lab.mml.value = decodeURIComponent(window.location.search.substr(1)).trim();
  Lab.Typeset();
}

