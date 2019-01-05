MathJax = {
    startup: {
        ready: () => MathJax.startup.pagePromise.then(() => MathJax.startup.defaultReady())
    },
    chtml: {
        fontURL: 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.3/mathjax2/css'
    }
};


if (typeof require !== 'undefined') {
    MathJax.loader = {require: require};
    MathJax.loader.source = require('../../src/source.js').source;
    MathJax.startup.document = '$$x+1$$';
}
