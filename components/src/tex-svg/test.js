MathJax = {
    loader: {
        load: ['adaptors/liteDom.js'],
        paths: {
            mathjax: '../../../es5'
        },
        require: require,
        ready: () => {}
    }
}
require('../../../es5/tex-svg.js');
MathJax.loader.defaultReady();

console.log(MathJax.startup.adaptor.outerHTML(MathJax.tex2svg('x+1')));
