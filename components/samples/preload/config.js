MathJax = {
    startup: {
        ready: () => MathJax.startup.pagePromise.then(() => MathJax.startup.defaultReady())
    },
    chtml: {
        fontURL: 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.3/mathjax2/css'
    }
};

const useDist = false;

if (typeof require !== 'undefined') {
    MathJax.loader = {require: require};
    if (useDist) {
        MathJax.loader.paths = {mathjax: '../../dist'};
        MathJax.loader.source = {sre: '../../mathjax3/a11y/sre-node.js'};
    } else {
        MathJax.loader.source = require('../../src/source.js').source;
    }
    MathJax.startup.document = '$$x+1$$';
    MathJax.startup.typeset = false;
}
