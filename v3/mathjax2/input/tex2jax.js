var MathJax = require("../legacy/MathJax.js").MathJax;

MathJax.Ajax.Preloading("[MathJax]/extensions/tex2jax.js");
require("../legacy/extensions/tex2jax.js");

var HTMLMathItem = require("../../mathjax3/handlers/html/HTMLMathItem.js").HTMLMathItem;

var tex2jax = MathJax.Extension.tex2jax,
    encloseMath = tex2jax.encloseMath,
    HTML = MathJax.HTML;

tex2jax.encloseMath = function (element) {
  var search = this.search;
  search.openDelim = search.open.textContent.substr(search.opos,search.olen);
  search.closeDelim = search.close.textContent.substr(search.cpos-search.clen,search.clen);
  return encloseMath.call(tex2jax,element);
}

MathJax.Extension.tex2jax.createPreview = function (mode,tex) {};

MathJax.Extension.tex2jax.createMathTag = function (mode,tex) {
  var search = this.search;
  var node = HTML.TextNode(search.openDelim+tex + search.closeDelim)
  this.insertNode(node);
  var item = new HTMLMathItem(
    tex, this.jax, mode !== '',
    {node:node, n:0, delim:search.openDelim},
    {node:node, n:tex.length-1, delim:search.closeDelim}
  );
  math.push(item);
  return node.nextSibling;
};

var math;
exports.LegacyTeX2jax = {
  FindMath: function (node,jax) {
    math = [];
    MathJax.HTML.setDocument(node.ownerDocument);
    MathJax.Extension.tex2jax.jax = jax;
    MathJax.Extension.tex2jax.PreProcess(node);
    return math;
  }
};
