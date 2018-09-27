import {TeX} from "mathjax3/input/tex.js";
import {MathML} from "mathjax3/input/mathml.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {HTMLMathItem} from "mathjax3/handlers/html/HTMLMathItem.js";
import {HTMLDocument} from "mathjax3/handlers/html/HTMLDocument.js";
import {handleRetriesFor} from "mathjax3/util/Retries.js";
import {browserAdaptor} from "mathjax3/adaptors/browserAdaptor.js";

import {ConfigurationHandler} from 'mathjax3/input/tex/Configuration.js';
import {SerializedMmlVisitor as MmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';

import 'mathjax3/input/tex/base/BaseConfiguration.js';
import 'mathjax3/input/tex/ams/AmsConfiguration.js';
import 'mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import 'mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax3/input/tex/newcommand/NewcommandConfiguration.js';

// import 'node_modules/speech-rule-engine/lib/sre_browser.js';
import 'speech-rule-engine/lib/sre_browser.js';

let tex = new TeX();
let mathml = new MathML();
let chtml = new CHTML();
let visitor = new MmlVisitor();

let texDoc = new HTMLDocument(document, browserAdaptor(), {InputJax: tex, OutputJax: chtml});
let mmlDoc = new HTMLDocument(document, browserAdaptor(), {InputJax: mathml, OutputJax: chtml});
document.head.appendChild(chtml.styleSheet(mmlDoc));
let toMml = (node => visitor.visitTree(node, window.document));


const Lab = window.Lab = {
  tex: document.getElementById('tex'),
  output: document.getElementById('output'),
  display: true,
  packages: {},
  old: null,
  new: null,
  region: null,
  inner: null,
  
  Typeset() {
    this.output.innerHTML = '';
    let tex = new TeX({packages: this.getPackages()});
    let text = this.output.appendChild(document.createTextNode(''));

    let value = this.tex.value;
    let math = new HTMLMathItem(value, tex);
    math.setMetrics(16,8,16*20,100000,1);
    math.display = this.display;
    math.start = {node: text, n: 0, delim: ''};
    math.end = {node: text, n: 0, delim: ''};
    this.jax = math;

    handleRetriesFor(function () {
      math.compile();
      math.root.setTeXclass();
      let mml = toMml(math.root);
      let enriched = SRE.toEnriched(mml);
      let math2 = new HTMLMathItem(enriched.outerHTML, mathml);      
      math2.compile();
      math2.typeset(mmlDoc);
      math.typesetRoot = math2.typesetRoot;
      Lab.new = toMml(math2.root);
    }).then(() => {Lab.Update(math.typesetRoot.outerHTML);
                   Lab.Explorer(Lab.output.childNodes[0]);}
           )
      .catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
  },

  Speech(node, walker) {
    if (sre.Engine.isReady()) {
      var speech = walker.speech();
      node.setAttribute('hasspeech', 'true');
    } else {
      setTimeout(function() {Lab.Speech(node, walker);}, 20);
    }
  },

  Explorer(node) {
    let highlighter = sre.HighlighterFactory.highlighter(
      {color: 'blue', alpha: .2},
      {color: 'red', alpha: 1},
      {renderer: 'CommonHTML', browser: 'Chrome'}
    );
    // Add speech
    let speechGenerator = new sre.TreeSpeechGenerator();
    var dummy = new sre.DummyWalker(
      node, speechGenerator, highlighter, Lab.new);
    this.Speech(node, dummy);
    speechGenerator = new sre.DirectSpeechGenerator();
    let walker = new sre.TableWalker(
      node, speechGenerator, highlighter, Lab.new);
    node.tabIndex = 1;
    Lab.old = node;
    Lab.output.addEventListener('keydown',
                                function(event) {
                                  walker.move(event.keyCode);
                                  highlighter.unhighlight();
                                  highlighter.highlight(walker.getFocus().getNodes());
                                  Lab.UpdateRegion(walker.speech());
                                  event.stopPropagation();
                                });
    walker.activate();
    highlighter.highlight(walker.getFocus().getNodes());
    this.LiveRegion();
    this.Show(node, highlighter);
  },

  // Liveregion stuff.
  LiveRegion: function() {
    this.Styles();
    var element = document.createElement('div');
    element.classList.add('MJX_LiveRegion');
    element.setAttribute('aria-live', 'assertive');
    this.region = element;
    this.inner = document.createElement('div');
    this.region.appendChild(this.inner);
    document.body.appendChild(element);
  },
  
  Styles: function() {
    let styles = {'.MJX_LiveRegion':
                  {
                    position: 'absolute', top: '0', height: '1px', width: '1px',
                    padding: '1px', overflow: 'hidden'
                  },
                  '.MJX_LiveRegion_Show':
                  {
                    top: '0', position: 'absolute', width: 'auto', height: 'auto',
                    padding: '0px 0px', opacity: 1, 'z-index': '202',
                    left: 0, right: 0, 'margin': '0 auto',
                    'background-color': 'rgba(0, 0, 255, 0.2)', 'box-shadow': '0px 10px 20px #888',
                    border: '2px solid #CCCCCC'
                  }
                 };
    let sheet = window.document.styleSheets[0];
    for (let rule in styles) {
      let styleStr = [];
      let current = styles[rule];
      for (let style in current) {
        styleStr.push(style + ': ' + current[style]);
      }
      console.log(styleStr.join('; '));
      let node = document.createElement('style');
      node.innerHTML = rule + '{' + styleStr.join('; ') + '}';
      document.head.appendChild(node);
      // sheet.insertRule(rule + '{' + styleStr.join('; ') + '}', sheet.cssRules.length);
    }
  },
        
  //
  // Shows the live region as a subtitle of a node.
  //
  Show: function(node, highlighter) {
    this.region.classList.add('MJX_LiveRegion_Show');
    var rect = node.getBoundingClientRect();
    var bot = rect.bottom + 10 + window.pageYOffset;
    var left = rect.left + window.pageXOffset;
    this.region.style.top = bot + 'px';
    this.region.style.left = left + 'px';
    var color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  },


  //
  // Takes the live region out of the page flow.
  //
  Hide: function(node) {
    this.region.classList.remove('MJX_LiveRegion_Show');
  },
  //
  // Clears the speech div.
  //
  Clear: function() {
    this.UpdateRegion('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  },
  UpdateRegion: function(speech) {
    this.region.textContent = '';
    this.region.textContent = speech;
  },

  
  Keep() {
    window.location.search = "?" + [
      (this.display ? 1 : 0) + encodeURIComponent(this.tex.value)].
      concat(this.getPackages()).join(';');
  },
  
  Update(html) {
    this.output.innerHTML = html;
  },

  setPackages(packages) {
    for (let pack of packages) {
      let node = document.getElementById('package-' + pack);
      if (node) {
        node.checked = true;
      }
    }
  },

  getPackages() {
    let result = [];
    for (let key in this.packages) {
      if (document.getElementById(this.packages[key]).checked) {
        result.push(key);
      }
    }
    return result;
  },
  
  Packages() {
    let div = document.getElementById('package');
    for (let key of ConfigurationHandler.keys()) {
      if (key === 'empty' || key === 'extension') continue;
      let checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = key;
      checkbox.value = key;
      checkbox.id = 'package-' + key;
      if (key === 'base') checkbox.checked = true;
      let label = document.createElement('label');
      label.htmlFor = 'package-' + key;
      label.appendChild(document.createTextNode(key[0].toUpperCase() + key.slice(1)));
      checkbox.appendChild(label);
      div.appendChild(checkbox);
      div.appendChild(label);
      this.packages[key] = 'package-' + key;
    }
  },
  
  setDisplay(checked) {
    this.display = checked;
    this.Typeset();
  },
  
  checkKey: function (textarea, event) {
    if (!event) event = window.event;
    var code = event.which || event.keyCode;
    if ((event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) &&
        (code === 13 || code === 10)) {
      if (event.preventDefault) event.preventDefault();
      event.returnValue = false;
      this.Typeset();
    }
  }

}

Lab.Packages();
if (window.location.search !== "") {
  let [expr, ...rest] = decodeURIComponent(window.location.search).split(';');
  Lab.tex.value = expr.substr(2); // decodeURIComponent(expr.substr(2));
  Lab.display = expr.substr(1,1) === '1';
  document.getElementById('display').checked = Lab.display;
  Lab.setPackages(rest);
  Lab.Typeset();
}

