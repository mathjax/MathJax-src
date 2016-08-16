import {MathJax} from "mathjax/mathjax.js";
import "mathjax/handlers/html.js";
import "mathjax/input/LegacyTeX.js";

let html = MathJax.HandlerFor("<html></html>");
html.TestMath("\\sum_{n=0}^\\infty x_n").Compile();
