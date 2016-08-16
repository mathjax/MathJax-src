MathJax = require("./LegacyMJ.js").MathJax;

MathJax.Ajax.Preloading(
  "[MathJax]/jax/input/TeX/config.js",
  "[MathJax]/jax/input/TeX/jax.js",
  "[MathJax]/jax/element/mml/jax.js"
);

require("./LegacyMJ/element/jax.js");
require("./LegacyMJ/input/TeX/config.js");
require("./LegacyMJ/input/TeX/jax.js");

require("./LegacyMJ/element/JSON.js");

exports.Translate = function (tex,display) {
  var script = {
    type:"math/tex"+(display?"; mode=display":""),
    innerText: tex
  };
  return MathJax.InputJax.TeX.Translate(script).root.toJSON();
}
