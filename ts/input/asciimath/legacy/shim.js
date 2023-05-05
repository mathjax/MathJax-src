MathJax = Object.assign(global.MathJax || {}, require("./MathJax.js").MathJax);

//
//  Load component-based configuration, if any
//
if (MathJax.config && MathJax.config.asciimath) {
  MathJax.Hub.Config({AsciiMath: MathJax.config.asciimath});
}

MathJax.Ajax.Preloading(
  "[MathJax]/jax/input/AsciiMath/config.js",
  "[MathJax]/jax/input/AsciiMath/jax.js",
  "[MathJax]/jax/element/mml/jax.js"
);

require("./jax/element/mml/jax.js");
require("./jax/input/AsciiMath/config.js");
require("./jax/input/AsciiMath/jax.js");

require("./jax/element/MmlNode.js");

module.exports.AsciiMath = MathJax.InputJax.AsciiMath;
