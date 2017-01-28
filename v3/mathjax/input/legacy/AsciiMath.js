MathJax = require("../../legacy/MathJax.js").MathJax;

MathJax.Ajax.Preloading(
  "[MathJax]/jax/input/AsciiMath/config.js",
  "[MathJax]/jax/input/AsciiMath/jax.js",
  "[MathJax]/jax/element/mml/jax.js"
);

require("../../legacy/jax/element/mml/jax.js");
require("../../legacy/jax/input/AsciiMath/config.js");
require("../../legacy/jax/input/AsciiMath/jax.js");

require("../../legacy/jax/element/JSON.js");

var Tree = require("../../../TreeJax/lib/tree.js").Tree;

exports.LegacyAsciiMath = {
  Compile: function (am,display) {
    return Tree.parse(this.Translate(am,display));
  },
  Translate: function (am,display) {
    var script = {
      type:"math/asciimath",
      innerText: am,
      MathJax: {}
    };
    return MathJax.InputJax.AsciiMath.Translate(script).root.toJSON();
  }
};
