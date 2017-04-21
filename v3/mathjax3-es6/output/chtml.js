import {OutputJax} from "../core/OutputJax.js";
import {LegacyCHTML} from "./legacy/CommonHTML.js";
import {DefaultOptions} from "../util/Options.js";

export class CHTML extends OutputJax {

  //
  //  Typeset a MathItem tree
  //
  Typeset(math,html) {
   return LegacyCHTML.Typeset(math,html);
  }
  
  //
  //  Handle an escaped character
  //  (put it in a span so that it won't be a delimiter if
  //  the page is typeset again).
  //
  Escaped(math,html) {
    let span = html.document.createElement("span");
    span.appendChild(html.document.createTextNode(math.math));
    return span;
  }

  //
  //  Determine metrics for the locations of the math elements
  //
  GetMetrics(html) {
    return LegacyCHTML.GetMetrics(html);
  }
    
  //
  //  Produces the CSS style element for the CommonHTML output
  //
  StyleSheet(html) {
    return LegacyCHTML.StyleSheet(html);
  }

};

CHTML.NAME = "CHTML";
CHTML.OPTIONS = DefaultOptions({},OutputJax.OPTIONS);
