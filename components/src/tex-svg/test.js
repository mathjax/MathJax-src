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
require('../../dist/tex-svg.js');
MathJax.loader.defaultReady();

console.log(MathJax.startup.adaptor.outerHTML(MathJax.tex2svg('x+1')));
