MathJax = {
    loader: {
        load: ['adaptors/liteDom.js'],
        paths: {
            mathjax: '../../dist'
        },
        require: require,
        ready: () => {}
    }
}
require('../../dist/tex-chtml.js');
MathJax.loader.defaultReady();

console.log(MathJax.tex2mml('x+1'));
