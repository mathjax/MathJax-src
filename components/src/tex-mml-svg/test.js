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
require('../../dist/tex-mml-svg.js');
MathJax.loader.defaultReady();

console.log(MathJax.startup.adaptor.outerHTML(MathJax.tex2svg('x+1')));
console.log(MathJax.startup.adaptor.outerHTML(MathJax.mathml2svg('<math><mi>x</mi></math>')));
