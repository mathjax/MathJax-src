import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {AbstractMathItem} from "mathjax3/core/MathItem.js";
import {AbstractMathDocument} from "mathjax3/core/MathDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

class LabMathItem extends AbstractMathItem {};
class LabMathDocument extends AbstractMathDocument {};

let tex = new TeX();
let chtml = new CHTML();

let adaptor = new browserAdaptor();
tex.setAdaptor(adaptor);
chtml.setAdaptor(adaptor);

let doc = new LabMathDocument(document,adaptor,{OutputJax: chtml});
document.head.appendChild(chtml.styleSheet(doc));

const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  
  Typeset() {
    let TeX = this.tex.value;
    let math = new LabMathItem(TeX,tex);
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
    window.location.search = "?" + (this.display ? 1 : 0) + encodeURIComponent(this.tex.value);
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

if (window.location.search !== "") {
  Lab.tex.value = decodeURIComponent(window.location.search.substr(2));
  Lab.display = window.location.search.substr(1,1) === '1';
  document.getElementById('display').checked = Lab.display;
  Lab.Typeset();
}

