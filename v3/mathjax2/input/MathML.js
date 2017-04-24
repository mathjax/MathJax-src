MathJax = require("../legacy/MathJax.js").MathJax;

MathJax.Ajax.Preloading(
  "[MathJax]/jax/input/MathML/config.js",
  "[MathJax]/jax/input/MathML/jax.js",
  "[MathJax]/jax/element/mml/jax.js",
  "[MathJax]/jax/input/MathML/entities/a.js",
  "[MathJax]/jax/input/MathML/entities/b.js",
  "[MathJax]/jax/input/MathML/entities/c.js",
  "[MathJax]/jax/input/MathML/entities/d.js",
  "[MathJax]/jax/input/MathML/entities/e.js",
  "[MathJax]/jax/input/MathML/entities/f.js",
  "[MathJax]/jax/input/MathML/entities/fr.js",
  "[MathJax]/jax/input/MathML/entities/g.js",
  "[MathJax]/jax/input/MathML/entities/h.js",
  "[MathJax]/jax/input/MathML/entities/i.js",
  "[MathJax]/jax/input/MathML/entities/j.js",
  "[MathJax]/jax/input/MathML/entities/k.js",
  "[MathJax]/jax/input/MathML/entities/l.js",
  "[MathJax]/jax/input/MathML/entities/m.js",
  "[MathJax]/jax/input/MathML/entities/n.js",
  "[MathJax]/jax/input/MathML/entities/o.js",
  "[MathJax]/jax/input/MathML/entities/opf.js",
  "[MathJax]/jax/input/MathML/entities/p.js",
  "[MathJax]/jax/input/MathML/entities/q.js",
  "[MathJax]/jax/input/MathML/entities/r.js",
  "[MathJax]/jax/input/MathML/entities/s.js",
  "[MathJax]/jax/input/MathML/entities/scr.js",
  "[MathJax]/jax/input/MathML/entities/t.js",
  "[MathJax]/jax/input/MathML/entities/u.js",
  "[MathJax]/jax/input/MathML/entities/v.js",
  "[MathJax]/jax/input/MathML/entities/w.js",
  "[MathJax]/jax/input/MathML/entities/x.js",
  "[MathJax]/jax/input/MathML/entities/y.js",
  "[MathJax]/jax/input/MathML/entities/z.js"
);

require("../legacy/jax/element/mml/jax.js");
require("../legacy/jax/input/MathML/config.js");
require("../legacy/jax/input/MathML/jax.js");
require("../legacy/jax/input/MathML/entities/a.js");
require("../legacy/jax/input/MathML/entities/b.js");
require("../legacy/jax/input/MathML/entities/c.js");
require("../legacy/jax/input/MathML/entities/d.js");
require("../legacy/jax/input/MathML/entities/e.js");
require("../legacy/jax/input/MathML/entities/f.js");
require("../legacy/jax/input/MathML/entities/fr.js");
require("../legacy/jax/input/MathML/entities/g.js");
require("../legacy/jax/input/MathML/entities/h.js");
require("../legacy/jax/input/MathML/entities/i.js");
require("../legacy/jax/input/MathML/entities/j.js");
require("../legacy/jax/input/MathML/entities/k.js");
require("../legacy/jax/input/MathML/entities/l.js");
require("../legacy/jax/input/MathML/entities/m.js");
require("../legacy/jax/input/MathML/entities/n.js");
require("../legacy/jax/input/MathML/entities/o.js");
require("../legacy/jax/input/MathML/entities/opf.js");
require("../legacy/jax/input/MathML/entities/p.js");
require("../legacy/jax/input/MathML/entities/q.js");
require("../legacy/jax/input/MathML/entities/r.js");
require("../legacy/jax/input/MathML/entities/s.js");
require("../legacy/jax/input/MathML/entities/scr.js");
require("../legacy/jax/input/MathML/entities/t.js");
require("../legacy/jax/input/MathML/entities/u.js");
require("../legacy/jax/input/MathML/entities/v.js");
require("../legacy/jax/input/MathML/entities/w.js");
require("../legacy/jax/input/MathML/entities/x.js");
require("../legacy/jax/input/MathML/entities/y.js");
require("../legacy/jax/input/MathML/entities/z.js");

require("../legacy/jax/element/MmlNode.js");

var window = require("../../mathjax3/util/document.js").window;

var MmlFactory = require("../../mathjax3/core/MmlTree/MmlFactory.js").MmlFactory;
var factory = new MmlFactory();

MathJax.InputJax.MathML.Augment({
  createParser: function () {
    if (window.DOMParser) {
      this.parser = new window.DOMParser();
      return(this.parseDOM);
    } else if (window.ActiveXObject) {
      this.parser = this.createMSParser();
      if (!this.parser) {
        MathJax.Localization.Try(this.parserCreationError); 
        return(this.parseError);
      }
      this.parser.async = false;
      return(this.parseMS);
    }
    this.div = MathJax.Hub.Insert(document.createElement("div"),{
         style:{visibility:"hidden", overflow:"hidden", height:"1px",
                position:"absolute", top:0}
    });
    if (!document.body.firstChild) {document.body.appendChild(this.div)}
      else {document.body.insertBefore(this.div,document.body.firstChild)}
    return(this.parseDIV);
  }
});

exports.LegacyMathML = {
  Compile: function (mml,display) {
    var script = {
      type:"math/mml",
      innerText: mml,
      MathJax: {}
    };
    var node = MathJax.InputJax.MathML.Translate(script).root.toMmlNode(factory);
    node.setInheritedAttributes();
    return node;
  },
  Translate: function (mml,display) {
    return this.Compile(mml,display);
  }
};
