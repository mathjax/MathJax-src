import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {AbstractMathItem} from "mathjax3/core/MathItem.js";
import {AbstractMathDocument} from "mathjax3/core/MathDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";

import {myHTMLNodes} from "./lib/myHTMLNodes.js";
import {myDocument} from "./lib/myDOM.js";

/*
 * Create the input and output jax, 
 * and use myHTMLNodes as the node library for the CHTML output
 */
const tex = new TeX();
const chtml = new CHTML();
chtml.nodes = new myHTMLNodes();

/*
 * Create a generic MathItem with the TeX expression from the command line
 * and give it some fake metrics (em-size, ex-size, container width, wrap width, scale)
 */
const math = new AbstractMathItem(process.argv[3] || "", tex);
math.setMetrics(14, 6, 1000000, 1000000, 1);

/*
 * Create a MathDocument for the MathItem
 */
const doc = new AbstractMathDocument(new myDocument(), {OutputJax: chtml});

/*
 * Convert the TeX to HTML and display it
 */
handleRetriesFor(function () {

    math.compile();
    math.typeset(doc);

    console.log(math.typesetRoot.outerHTML);

}).catch(
    err => console.log("Error: " + err.message)
);
