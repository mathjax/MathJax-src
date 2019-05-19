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
require('../../dist/mml-svg.js');
MathJax.loader.defaultReady();

console.log(MathJax.startup.adaptor.outerHTML(MathJax.mathml2svg('<math><mi>x</mi></math>')));
