MathJax = require("../../legacy/MathJax.js").MathJax;

MathJax.Ajax.Preloading(
  "[MathJax]/extensions/MathEvents.js",
  "[MathJax]/jax/output/Common/config.js",
  "[MathJax]/jax/output/CommonHTML/jax.js",
  "[MathJax]/jax/output/CommonHTML/fonts/TeX/fontdata.js"
);

require("../../legacy/jax/output/CommonHTML/config.js");
require("../../legacy/jax/output/CommonHTML/jax.js");
require("../../legacy/jax/output/CommonHTML/fonts/TeX/fontdata.js");

var CHTML = MathJax.OutputJax.CommonHTML;
var HTML = MathJax.HTML;

CHTML.Augment({
  Startup: function () {}  // for now
});

//
//  Make sure we wait for CHTML to fully load
//
var ready = MathJax.Hub.Register.StartupHook("CommonHTML Jax Ready",{});

//
//  Tell CHTML it is OK to proceed
//
MathJax.Hub.Startup.signal.Post("onLoad");

//
//  The Tree-to-ElementJax visitor
//
MmlVisitor = require("TreeJax/lib/mml_visitor.js").MmlVisitor;
var visitor = new MmlVisitor();

exports.Typeset = function (math,html) {
  if (!ready.called) MathJax.Hub.RestartAfter(ready);
  HTML.setDocument(html.document);
  visitor.visitTree(math.tree);
  var mml = visitor.getResult();
  var jax = {
    CHTML: {
      em:14, outerEm:14, scale:1, cwidth:1000000, lineWidth:1000000,
      display: math.display
    }
  };
  CHTML.getMetrics(jax);
  var node = CHTML.Element("mjx-chtml",{className:"MathJax_CHTML"}), NODE = node;
  if (math.display) {
    NODE = CHTML.Element("mjx-chtml",{className:"MJXc-display",isMathJax:false});
    NODE.appendChild(node);
  }
  if (CHTML.scale !== 1) node.style.fontSize = jax.CHTML.fontSize;
  CHTML.initCHTML(mml,node);
  CHTML.CHTMLnode = node;
  try {
    mml.setTeXclass();
    mml.toCommonHTML(node);
  } catch (err) {
    delete this.CHTMLnode;
    throw err;
  }
  delete this.CHTMLnode;
  return NODE;
}
