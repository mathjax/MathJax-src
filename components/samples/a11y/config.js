MathJax = {
    loader: {
        load: ["a11y/complexity", "input/tex"],
        paths: {
            mathjax: '../../dist'
        },
        source: {
            sre: '../../node_modules/speech-rule-engine/lib/sre_browser.js'
        }
    },
    startup: {
        ready() {
            MathJax.startup.defaultReady();
            console.log(MathJax.tex2mml('a+b+c+d+e'));
        }
    },
    chtml: {
        fontURL: 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.3/mathjax2/css'
    },
    'a11y/complexity': {
        makeCollapsible: false
    }
};


const useDist = false;

if (typeof require !== 'undefined') {
    MathJax.loader.require = require;
    MathJax.loader.load.push('liteDOM');
    if (useDist) {
        MathJax.loader.paths = {mathjax: '../../dist'};
        MathJax.loader.source.sre = '../../mathjax3/a11y/sre-node.js';
    } else {
        MathJax.loader.source = require('../../src/source.js').source;
    }
    MathJax.startup.document = '$$x+1$$';
    MathJax.startup.typeset = false;
}
