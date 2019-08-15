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
require('../../../es5/mml-svg.js');
MathJax.loader.defaultReady();

console.log(MathJax.startup.adaptor.outerHTML(MathJax.mathml2svg('<math><mi>x</mi></math>')));
