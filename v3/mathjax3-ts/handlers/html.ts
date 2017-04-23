import {MathJax} from "../mathjax.js";
import {HTMLHandler} from './html/HTMLHandler.js';

const HTML = new HTMLHandler("HTML");
MathJax.handlers.Register(HTML);
