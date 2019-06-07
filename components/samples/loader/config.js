MathJax = {
    loader: {
        load: ["input/tex", "output/chtml"]
    },
    startup: {
        ready() {
            MathJax.startup.defaultReady();
//            console.log(MathJax.chtmlStylesheet());
            console.log(MathJax.tex2mml('x+1'));
//            console.log(MathJax.startup.adaptor.outerHTML(MathJax.tex2chtml('x+1')));
//            MathJax.tex2mmlPromise('x+1').then((mml) => console.log(mml));
//            MathJax.Typeset();
//            const adaptor = MathJax.startup.adaptor;
//            console.log(adaptor.outerHTML(adaptor.body(MathJax.startup.document.document)));
        }
    },
    chtml: {
        fontURL: 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.3/mathjax2/css'
    }
};



const useDist = false;

if (typeof require !== 'undefined') {
    MathJax.loader.require = require;
    MathJax.loader.load.push('adaptors/liteDOM');
    if (useDist) {
        MathJax.loader.paths = {mathjax: '../../dist'};
        MathJax.loader.source = {sre: '../../mathjax3/a11y/sre-node.js'};
    } else {
        MathJax.loader.source = require('../../src/source.js').source;
    }
    MathJax.startup.document = '$$x+1$$';
    MathJax.startup.typeset = false;
}

