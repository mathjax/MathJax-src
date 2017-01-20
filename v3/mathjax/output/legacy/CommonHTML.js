window = require("../../util/document.js").window;
var document = require("../../util/document.js").document;
MathJax = require("../../legacy/MathJax.js").MathJax;

MathJax.Ajax.Preloading(
  "[MathJax]/extensions/MathEvents.js",
  "[MathJax]/jax/element/mml/jax.js",
  "[MathJax]/jax/output/Common/config.js",
  "[MathJax]/jax/output/CommonHTML/jax.js",
  "[MathJax]/jax/output/CommonHTML/fonts/TeX/fontdata.js"
);

require("../../legacy/jax/element/mml/jax.js");
require("../../legacy/jax/output/CommonHTML/config.js");
require("../../legacy/jax/output/CommonHTML/jax.js");
require("../../legacy/jax/output/CommonHTML/fonts/TeX/fontdata.js");

var CHTML = MathJax.OutputJax.CommonHTML;
var HTML = MathJax.HTML;
var AJAX = MathJax.Ajax;
var CSS;

var MAXWIDTH = 1000000;
var DEFAULT_EM = 16;

HTML.setDocument(document);

CHTML.Augment({
  Startup: function () {
    var STYLES = CHTML.config.styles;
    CSS = AJAX.StyleString(STYLES);
    delete STYLES[".MJXc-processing"];
    delete STYLES[".MJXc-processed"];
    delete STYLES[".mjx-test"];
    delete STYLES[".mjx-ex-box-test"];
    delete STYLES[".mjx-line-box-test"];
    delete STYLES[".mjx-line-box-test span"];
    delete STYLES["#MathJax_CHTML_Tooltip"];
    //
    this.pxPerInch = 96;
    //
    // Used in preTranslate to get scaling factors and line width
    //
    this.TestSpan = CHTML.Element("mjx-test",{style:{
      left:              "1em",
      display:           "block",
      "font-style":      "normal",
      "font-weight":     "normal",
      "font-size":       "100%",
      "font-size-adjust":"none",
      "text-indent":     0,
      "text-transform":  "none",
      "letter-spacing":  "normal",
      "word-spacing":    "normal",
      overflow:          "hidden",
      height:            "1px"
    }},[["mjx-ex-box-test",{style:{
      position:  "absolute",
      width:"1px", height:"60ex"
    }}]]);
    //
    // Used in preTranslate to get linebreak width
    //
    this.linebreakSpan = HTML.Element("span",{
      className:"mjx-line-box-test",
      style: {display: "table!important"}
    },[["span",{style:{
      display: "table-cell!important",
      width: "10000em!important",
      "min-width":0, "max-width":"none",
      padding:0, border:0, margin:0
    }}]]);
  },
  getFontSize: function (node) {
    var style = window.getComputedStyle(node);
    return parseFloat(style.fontSize) || DEFAULT_EM;
  }
});

//
//  Make sure we wait for CHTML to fully load.
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

exports.LegacyCHTML = {

  //
  //  Typeset a MathItem tree
  //
  Typeset: function (math,html) {
    if (!ready.called) MathJax.Hub.RestartAfter(ready);
    HTML.setDocument(html.document);
    visitor.visitTree(math.tree);
    var mml = visitor.getResult();
    var metrics = math.metrics;
    var jax = {
      CHTML: {
        em: metrics.em, outerEm: metrics.em / metrics.scale, ex: metrics.ex,
        scale: metrics.scale, fontSize: Math.ceil(metrics.scale*100) + "%",
        cwidth: metrics.containerWidth, lineWidth: metrics.lineWidth,
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
  },

  //
  //  Determine metrics for the locations of the math elements
  //
  GetMetrics: function (html) {
    if (!ready.called) MathJax.Hub.RestartAfter(ready);

    var i, m = html.math.length, math, test, node;
    var em, ex, cwidth, lwidth, relwidth, width, linebreak, maxwidth = MAXWIDTH;
    var document = html.document;
    var CONFIG = CHTML.config;

    var canMeasure = (html.document.body.offsetWidth > 0);
  
    //
    //  Get linebreaking information
    //
    width = CHTML.config.linebreaks.width;
    linebreak = CHTML.config.linebreaks.automatic;
    if (linebreak) {
      relwidth = !!width.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/);
      if (relwidth) width = width.replace(/\s*container\s*/,"");
      if (width === "") width = "100%";
    }
    //
    //  Insert spans for size testing
    //
    if (canMeasure) {
      for (i = 0; i < m; i++) {
        node = html.math[i].start.node;
        test = document.importNode(CHTML.linebreakSpan,true);
        node.parentNode.insertBefore(test,node);
        test = document.importNode(CHTML.TestSpan,true);
        node.parentNode.insertBefore(test,node);
      }
    }
    //
    //  Collect size information
    //
    for (i = 0; i < m; i++) {
      math = html.math[i]; node = math.start.node;
      em = CHTML.getFontSize(node.parentNode);
      if (canMeasure) {
        test = node.previousSibling;
        ex = test.firstChild.offsetHeight / 60;
        cwidth = Math.max(0,test.previousSibling.firstChild.offsetWidth-2);
      }
      if (ex === 0 || isNaN(ex) || !canMeasure) {
        ex = Math.ceil(em/2);
        cwidth = MAXWIDTH;
      }
      if (relwidth) maxwidth = cwidth;
      scale = (CONFIG.matchFontHeight ? ex/CHTML.TEX.x_height/em : 1);
      scale = Math.floor(Math.max(CONFIG.minScaleAdjust/100,scale)*CONFIG.scale);
      scale /= 100; em *= scale; cwidth /= em;
      lwidth = (linebreak ? CHTML.length2em(width,maxwidth/em,1) : maxwidth);
      math.setMetrics(em, ex, cwidth, lwidth, scale);
    }
    //
    //  Remove test spans
    //
    if (canMeasure) {
      for (i = 0; i < m; i++) {
        node = html.math[i].start.node;
        node.parentNode.removeChild(node.previousSibling);
        node.parentNode.removeChild(node.previousSibling);
      }
    }
  },
    
  //
  //  Produces the CSS style element for the CommonHTML output
  //
  StyleSheet: function (html) {
    var sheet = html.document.createElement("style");
    sheet.setAttribute("id","MathJax-CHTML-Styles");
    var styles = AJAX.StyleString(CHTML.config.styles);
    sheet.appendChild(html.document.createTextNode(styles));
    return sheet;
  }

};
