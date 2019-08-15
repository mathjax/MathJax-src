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
require('../../../es5/tex-chtml.js');
MathJax.loader.defaultReady();

console.log(MathJax.tex2mml('x+1'));
