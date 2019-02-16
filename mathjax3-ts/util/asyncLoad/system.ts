import {MathJax} from '../../mathjax.js';

declare var System: {import: (name: string, url?: string) => any};
declare var __dirname: string;

let root = 'file://' + __dirname.replace(/\/\/[^\/]*$/, '/');

if (!MathJax.asyncLoad && typeof System !== 'undefined' && System.import) {
    MathJax.asyncLoad = (name: string) => {
        return System.import(name, root);
    };
}

export function setBaseURL(URL: string) {
    root = URL;
    if (!root.match(/\/$/)) {
        root += '/';
    }
}

