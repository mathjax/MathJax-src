import {MathJax} from '../../mathjax.js';

declare var require: (name: string) => any;
declare var __dirname: string;

const root = __dirname.replace(/\/[^\/]*\/[^\/]*$/, '/');

if (!MathJax.asyncLoad && typeof require !== 'undefined') {
    MathJax.asyncLoad = (name: string) => {
        return require(name.charAt(0) === '.' ? root + name : name);
    };
}

