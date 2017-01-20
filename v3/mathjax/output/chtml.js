import {OutputJax} from "../core/OutputJax.js";
import {LegacyCHTML} from "./legacy/CommonHTML.js";

export class CHTML extends OutputJax {

  //
  //  Typeset a MathItem tree
  //
  Typeset(math,html) {
   return LegacyCHTML.Typeset(math,html);
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
