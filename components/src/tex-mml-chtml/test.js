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
require('../../../es5/tex-mml-chtml.js');
MathJax.loader.defaultReady();

console.log(MathJax.tex2mml('x+1'));
console.log(MathJax.mathml2mml('<math><mi>x</mi></math>'));
