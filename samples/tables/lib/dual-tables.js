import {MathML} from "../../../mathjax3/input/mathml.js";
import {CHTML} from "../../../mathjax3/output/chtml.js";
import {SVG} from "../../../mathjax3/output/svg.js";
import {HTMLMathItem} from "../../../mathjax3/handlers/html/HTMLMathItem.js";
import {HTMLDocument} from "../../../mathjax3/handlers/html/HTMLDocument.js";
import {handleRetriesFor} from "../../../mathjax3/util/Retries.js";
import {browserAdaptor} from "../../../mathjax3/adaptors/browserAdaptor.js";

let mml = new MathML({forceReparse: true});
let chtml = new CHTML({fontURL: '../../mathjax2/css/'});
let svg = new SVG();

let docs = {
  CHTML: new HTMLDocument(document, browserAdaptor(), {InputJax: mml, OutputJax: chtml}),
  SVG:   new HTMLDocument(document, browserAdaptor(), {InputJax: mml, OutputJax: svg})
};

const samples = [
  '<mjx-samples>',
  '<mjx-description>',
  '',
  '</mjx-description>',
  '<mjx-tables>',
  '<mjx-chtml-table>',
  '',
  '</mjx-chtml-table>',
  '<mjx-svg-table>',
  '',
  '</mjx-svg-table>',
  '</mjx-tables>',
  '</mjx-samples>'
];

const div = document.createElement('div');
const template = document.getElementsByTagName('mjx-template')[0];

function CreateMathML() {
    const mathml = template.innerHTML;
    template.innerHTML = mathml.replace(/\&/g, '&amp;')
                               .replace(/</g, '&lt;')
                               .replace(/>/g, '&gt;')
                               .replace(/\n/g, '<br/>')
                               .replace(/\s/g, '\u00A0');
    Substitute(mathml, window.variables, '');
}

function Substitute(mml, data, descr) {
  if (data.length === 0) {
    addMathML(mml, descr);
    return;
  }
  const n = data.length - 1;
  const [name, values] = data[n];
  const rest = data.slice(0, n);
  const re = new RegExp('\\{'+name+'\\}', 'g');
  for (const value of values) {
    Substitute(mml.replace(re, value), rest, name + ': <b>' + value + '</b><br/>' + descr);
  }
}

function addMathML(mml, descr) {
  samples[2] = descr;
  samples[6] = samples[9] = mml;
  div.innerHTML = samples.join('\n');
  template.parentNode.insertBefore(div.firstChild, template);
}

CreateMathML();

function linkTables(n, m, arrow) {
    let N = String(n);
    if (N.length == 1) {
        N = '0' + N;
    }
    return '<a href="tables-' + N + '.html"' + (n === m ? ' disabled="true"' : '') + '>&#x' + arrow + ';</a>';
}

const testNo = parseInt(this.location.pathname.match(/-(\d+)\.html$/)[1]);
const maxTest = 60;

const nav = document.body.appendChild(document.createElement('div'));
nav.id = "navigation";
nav.innerHTML = [
    linkTables(testNo - 1, 0, '25C4'),
    linkTables(testNo + 1, maxTest + 1, '25BA')
].join(' ');


docs.CHTML
  .findMath({elements: ['mjx-chtml-table']})
  .compile()
  .getMetrics()
  .typeset()
  .updateDocument();

docs.SVG
  .findMath({elements: ['mjx-svg-table']})
  .compile()
  .getMetrics()
  .typeset()
  .updateDocument();
