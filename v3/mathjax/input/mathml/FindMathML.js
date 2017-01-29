import {UserOptions, DefaultOptions} from 'mathjax/util/Options.js';

const NAMESPACE = "http://www.w3.org/1998/Math/MathML";

//
//  Locates MathML expressions within DOM nodes
//
export class FindMathML {
  
  //
  //  Locate MathML nodes in the DOM
  //
  FindMath(node) {
    let set = new Set();
    this.FindMathNodes(node,set);
    this.FindMathPrefixed(node,set);
    if (node.ownerDocument.documentElement.nodeName === 'html' &&  set.length === 0) {
      this.FindMathNS(node,set);
    }
    return this.ProcessMath(set);
  }
  
  //
  //  Find plain <math> tags
  //
  FindMathNodes(node,set) {
    for (const math of node.getElementsByTagName("math")) {
      set.add(math);
    }
  }
  
  //
  //  Find <m:math> tags (or whatever prefixes there are)
  //
  FindMathPrefixed(node,set) {
    let html = node.ownerDocument.documentElement;
    for (const attr of Array.from(html.attributes)) {
      if (attr.nodeName.substr(0,6) === "xmlns:" && attr.nodeValue === NAMESPACE) {
        let prefix = attr.nodeName.substr(6);
        for (const math of node.getElementsByTagName(prefix+":math")) {
          set.add(math);
        }
      }
    }
  }
  
  //
  //  Find namespaced math in XHTML documents (is this really needed?)
  //
  FindMathNS(node,set) {
    for (const math of node.getElementsByTagNameNS(NAMESPACE,"math")) {
      set.add(math);
    }
  }
  
  //
  //  Produce the array of math records that can be converted into MathItems
  //
  ProcessMath(set) {
    let math = [];
    for (const mml of set) {
      let display = (mml.getAttribute("display") === "block" ||
                     mml.getAttribute("mode") === "display");
      let start = {node:mml, n:0, delim:''};
      let end   = {node:mml, n:0, delim:''};
      math.push({math:mml.outerHTML, start, end, display});
    }
    return math;
  }
  
};

FindMathML.OPTIONS = {};
