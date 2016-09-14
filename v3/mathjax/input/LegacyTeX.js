MathJax = require("./LegacyMJ.js").MathJax;

MathJax.Ajax.Preloading(
  "[MathJax]/jax/input/TeX/config.js",
  "[MathJax]/jax/input/TeX/jax.js",
  "[MathJax]/jax/element/mml/jax.js",
  "[MathJax]/extensions/TeX/AMSmath.js",
  "[MathJax]/extensions/TeX/AMSsymbols.js",
  "[MathJax]/extensions/TeX/AMScd.js",
  "[MathJax]/extensions/TeX/newcommand.js",
  "[MathJax]/extensions/TeX/unicode.js",
  "[MathJax]/extensions/TeX/mathchoice.js",
  "[MathJax]/extensions/TeX/bbox.js",
  "[MathJax]/extensions/TeX/HTML.js"
);

require("./LegacyMJ/element/jax.js");
require("./LegacyMJ/input/TeX/config.js");
require("./LegacyMJ/input/TeX/jax.js");
require("./LegacyMJ/extensions/TeX/AMSmath.js");
require("./LegacyMJ/extensions/TeX/AMSsymbols.js");
require("./LegacyMJ/extensions/TeX/AMScd.js");
require("./LegacyMJ/extensions/TeX/newcommand.js");
require("./LegacyMJ/extensions/TeX/unicode.js");
require("./LegacyMJ/extensions/TeX/mathchoice.js");
require("./LegacyMJ/extensions/TeX/bbox.js");
require("./LegacyMJ/extensions/TeX/HTML.js");

require("./LegacyMJ/element/JSON.js");

exports.Translate = function (tex,display) {
  var script = {
    type:"math/tex"+(display?"; mode=display":""),
    innerText: tex,
    MathJax: {}
  };
  return MathJax.InputJax.TeX.Translate(script).root.toJSON();
}
