import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import "mathjax/input/LegacyTeX.js";

let html = MathJax.HandlerFor("<html></html>");
// html.TestMath("\\sum_{n=0}^\\infty x_n").Compile();
// console.log(JSON.stringify(html.typeset));
// html.TestMath("x^2").Compile();
// console.log(JSON.stringify(html.typeset));
// html.TestMath("D^n_xw = \\sum_{0\\le j\\le n} \\sum_{\\scriptstyle k_1+k_2+\\cdots+k_n=j \\atop {\\scriptstyle k_1+2k_2+\\cdots+nk_n=n \\atop  {\\scriptstyle k_1,k_2,\\ldots,k_n\\ge0 }}} D^j_u w \\frac{n! {(D^1_x u)}^{k_1} \\cdots {(D^n_x u)}^{k_n} } {k_1!{(1!)}^{k_1} \\cdots k_n!{(n!)}^{k_n}}").Compile();
// console.log(JSON.stringify(html.typeset));
html.TestMath("D^n_xw = \\sum_{0\\le j\\le n} \\sum_{\\underbrace{\\substack{\\scriptstyle k_1+k_2+\\cdots+k_n=j \\\\ \\scriptstyle k_1+2k_2+\\cdots+nk_n=n \\\\ \\scriptstyle k_1,k_2,\\ldots,k_n\\ge0 }}_{\\mbox{lower constraint 1}}} D^j_u w \\frac{\\overbrace{n!  {(D^1_x u)}^{k_1} \\cdots {(D^n_x u)}^{k_n}} ^{\\mbox{ numerator 1}}} {\\underbrace{k_1!{(1!)}^{k_1} \\cdots k_n!{(n!)}^{k_n}}_{\\mbox{denominator 1}}}").Compile();
console.log(JSON.stringify(html.typeset));
