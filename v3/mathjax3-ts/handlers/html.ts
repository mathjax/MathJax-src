import {MathJax} from '../mathjax.js';
import {HTMLHandler} from './html/HTMLHandler.js';

MathJax.handlers.Register(new HTMLHandler());
