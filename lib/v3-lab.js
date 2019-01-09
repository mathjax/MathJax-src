import {MathJax} from '../mathjax3/mathjax.js';
import {TeX} from '../mathjax3/input/tex.js';
import {MathML} from '../mathjax3/input/mathml.js';
import {CHTML} from '../mathjax3/output/chtml.js';
//import {SVG} from '../mathjax3/output/svg.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';
import {SerializedMmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';
import {ComplexityHandler} from '../mathjax3/a11y/complexity.js';
import {sreReady} from '../mathjax3/a11y/sre.js';

import {ConfigurationHandler} from '../mathjax3/input/tex/Configuration.js';

import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
import '../mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';
//import {AllPackages} from '../mathjax3/input/tex/AllPackages.js';

import {SpeechExplorer, RoleExplorer, TypeExplorer, TagExplorer, Magnifier} from '../mathjax3/a11y/Explorer.js';
import {HoverRegion, LiveRegion, ToolTip} from '../mathjax3/a11y/Region.js';


const jax = {
    TeX: new TeX(),
 MathML: new MathML({forceReparse: true}),
  CHTML: new CHTML(),
//    SVG: new SVG()
};

ComplexityHandler(RegisterHTMLHandler(browserAdaptor()), jax.MathML);

const docs = {
    CHTML: MathJax.document(document, {InputJax: jax.TeX, OutputJax: jax.CHTML, makeCollapsible: false}),
//    SVG: MathJax.document(document, {InputJax: jax.TeX, OutputJax: jax.SVG, makeCollapsible: false})
};

const visitor = new SerializedMmlVisitor();
const toMml = (node => visitor.visitTree(node, Lab.doc.document));

const Lab = window.Lab = {
    input: document.getElementById('input'),
    output: document.getElementById('output'),
    mathml: document.getElementById('mathml'),
    display: true,
    showMML: false,
    enrich: false,
    compute: false,
    collapse: false,
    explore: true,
    packages: {},
    format: 'TeX',
    renderer: 'CHTML',
    doc: docs.CHTML,
    ijax: jax.TeX,
    ojax: jax.CHTML,
    mml: '',
    tex: '',
    explorer: [],
    explorerObjects: [],
    
    Typeset() {
        this.tex = '';
        this.output.innerHTML = '';
        let text = this.output.appendChild(document.createTextNode(''));
        if (!document.getElementById(this.renderer + '-styles')) {
            document.head.appendChild(this.ojax.styleSheet(this.doc));
        }

        let input = this.input.value;
        let math = new this.doc.options.MathItem(input, this.ijax, this.display);
        math.setMetrics(...this.metrics);
        math.start = {node: text, n: 0, delim: ''};
        math.end = {node: text, n: 0, delim: ''};
        this.mathItem = math;

        jax.TeX.parseOptions.tags.reset();

        MathJax.handleRetriesFor(function () {
            math.compile(this.doc);
            if (this.compute) {
                math.complexity(this.doc);
            } else if (this.enrich) {
                math.enrich(this.doc);
            }
            this.outputMML(math);
            math.typeset(this.doc);
            math.updateDocument(this.doc);
            this.addExplorer();
        }.bind(this)).catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
    },

    outputMML(math) {
        this.mml = toMml(math.root);
        this.mathml.innerHTML = '';
        if (this.showMML) {
            this.mathml.appendChild(document.createTextNode(this.mml.replace(/data-semantic/g, 'DS')));
        }
    },

    addExplorer() {
        if (this.explore) {
            const explorer = this.explorer;
            const node = this.output.childNodes[0];
            const {region, tooltip, tooltip2, tooltip3, magnifier} = this.explorerObjects;
            explorer.push(SpeechExplorer.create(this.doc, region, node, this.mml));
            explorer.push(TagExplorer.create(this.doc, tooltip2, node));
            explorer.push(RoleExplorer.create(this.doc, tooltip3, node));
            explorer.push(TypeExplorer.create(this.doc, tooltip, node));
            explorer.push(Magnifier.create(this.doc, magnifier, node, this.mml));
        }
    },
    
    Keep() {
        window.location.search = [
            '?',
            this.renderer.charAt(0),
            this.format.charAt(0),
            (this.display ? 1 : 0),
            (this.showMML ? 1 : 0),
            (this.enrich ? 1 : 0),
            (this.compute ? 1 : 0),
            (this.collapse ? 1 : 0),
            (this.explore ? 1 : 0),
            this.getPackageFlags(),
            encodeURIComponent(this.input.value)
        ].join('');
    },

    getPackageFlags() {
        const keys = Object.keys(this.packages);
        return keys.map(key => document.getElementById(this.packages[key]).checked ? 1 : 0).join('');
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
        for (let key of Array.from(ConfigurationHandler.keys()).sort()) {
            if (key === 'empty' || key === 'extension') continue;
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = key;
            checkbox.value = key;
            checkbox.id = 'package-' + key;
            checkbox.onchange = function () {Lab.newPackages()};
            if (key === 'base') checkbox.checked = true;
            let label = document.createElement('label');
            label.htmlFor = 'package-' + key;
            label.appendChild(document.createTextNode(key[0].toUpperCase() + key.slice(1)));
            checkbox.appendChild(label);
            let span = div.appendChild(document.createElement('span'));
            span = span.appendChild(document.createElement('span'));  
            span.appendChild(checkbox);
            span.appendChild(label);
            this.packages[key] = 'package-' + key;
        }
    },

    newPackages() {
        this.doc = docs[this.renderer];
        jax.TeX = new TeX({packages: this.getPackages()});
        jax.TeX.setAdaptor(this.doc.adaptor);
        jax.TeX.setMmlFactory(this.doc.mmlFactory);
        if (this.format === 'TeX') {
            docs.CHTML.inputJax = [jax.TeX];
//            docs.SVG.inputJax = [jax.TeX];
            this.ijax = jax.TeX;
        }
        Lab.Typeset();
    },

    disablePackages(disabled) {
        for (const input of document.querySelectorAll('#package input')) {
            input.disabled = disabled;
        }
    },
    
    setFormat(value) {
        const format = value.split(/ /);
        const changed = (this.format !== format[0]);
        if (changed) {
            this.format = format[0];
            this.ijax = jax[this.format];
            docs.CHTML.inputJax = [this.ijax]
//            docs.SVG.inputJax = [jax.ijax];
            this.ijax.setAdaptor(this.doc.adaptor);
            this.ijax.setMmlFactory(this.doc.mmlFactory);
        }
        let tex = '';
        if (format[0] === 'TeX') {
            this.display = format[1] === 'D';
            this.disablePackages(false);
            if (changed) {
                this.input.value = this.tex;
            }
        } else {
            this.disablePackages(true);
            tex = this.input.value;
            this.input.value = this.mml.replace(/ data-semantic-\S+="[^"]*"/g, '');
        }
        this.Typeset();
        this.tex = tex;
    },
    
    setRenderer(value) {
        this.renderer = value;
        this.doc = docs[value];
        this.ojax = jax[value];
        this.initExplorer(this.doc);
        this.Typeset();
    },
    
    setMathML(checked) {
        this.showMML = checked;
        this.Typeset();
    },
    
    setEnrich(checked) {
        this.enrich = checked;
        const compute = document.getElementById('compute');
        const collapse = document.getElementById('collapse');
        if (checked) {
            compute.disabled = false;
        } else {
            this.compute = this.collapse = false;
            compute.checked = collapse.checked = false;
            compute.disabled = collapse.disabled = true;
            this.setDocumentCollapse(docs.CHTML, false);
//            this.setDocumentCollapse(docs.SVG, false);
        }
        this.Typeset();
    },

    setCompute(checked) {
        this.compute = checked;
        const collapse = document.getElementById('collapse');
        if (checked) {
            collapse.disabled = false;
        } else {
            this.collapse = false;
            collapse.checked = false;
            collapse.disabled = true;
            this.setDocumentCollapse(docs.CHTML, false);
//            this.setDocumentCollapse(docs.SVG, false);
        }
        this.Typeset();
    },

    setCollapse(checked) {
        this.collapse = checked;
        this.setDocumentCollapse(docs.CHTML, checked);
//        this.setDocumentCollapse(docs.SVG, checked);
        this.Typeset();
    },

    setDocumentCollapse(doc, collapse) {
        doc.complexityVisitor.options.makeCollapsible = collapse;
    },

    setExplorer(checked) {
        this.explore = checked;
        this.Typeset();
    },

    initExplorer(doc) {
        // These should be held by the a11yDocument class.
        this.explorerObjects = {
            region: new LiveRegion(doc),
            tooltip: new ToolTip(doc),
            tooltip2: new ToolTip(doc),
            tooltip3: new ToolTip(doc),
            magnifier: new HoverRegion(doc)
        };
    },

    checkKey(textarea, event) {
        if (!event) event = window.event;
        var code = event.which || event.keyCode;
        if ((event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) &&
            (code === 13 || code === 10)) {
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
            this.Typeset();
        }
    },
    
    Init() {
        let test = jax.CHTML.getTestElement(this.output);
        let {em, ex, containerWidth, lineWidth, scale} = jax.CHTML.measureMetrics(test);
        this.metrics = [em, ex, containerWidth, lineWidth, scale];
        this.output.removeChild(test);
        document.getElementById('keep').disabled = false;
        document.getElementById('typeset').disabled = false;
    },
    
    Load() {
        const data = decodeURIComponent(window.location.search.substr(1));
        const n = Lab.getPackageFlags().length;
        this.input.value = data.substr(n + 8).trim();
        this.explore = data.charAt(7) === '1';
        this.collapse = data.charAt(6) === '1';
        this.compute = data.charAt(5) === '1';
        this.enrich = data.charAt(4) === '1';
        this.showMML = data.charAt(3) === '1';
        this.display = data.charAt(2) === '1';
        this.format = {T: 'TeX', M: 'MathML'}[data.charAt(1)];
        this.renderer = {C: 'CHTML', S: 'SVG'}[data.charAt(0)];
        this.doc = docs[this.renderer];
        this.ojax = jax[this.renderer];
        this.ijax = jax[this.format];
        const format = this.format + (this.format === 'TeX' ? ' ' + (this.display ? 'D' : 'I') : '');
        document.getElementById('format').value = format;
        document.getElementById('renderer').value = this.renderer;
        document.getElementById('showMML').checked = this.showMML;
        document.getElementById('enrich').checked = this.enrich;
        document.getElementById('compute').checked = this.compute;
        document.getElementById('collapse').checked = this.collapse;
        document.getElementById('explore').checked = this.explore;
        document.getElementById('compute').disabled = !this.enrich;
        document.getElementById('collapse').disabled = !this.compute;
        this.setDocumentCollapse(docs.CHTML, this.collapse);
//        this.setDocumentCollapse(docs.SVG, this.collapse);
        const flags = data.substr(8,n); 
        let i = 0;
        for (const key in Lab.packages) {
            if (flags.charAt(i++) === '1') {
                document.getElementById(Lab.packages[key]).checked = true;
            }
        }
        if (this.format === 'MathML') Lab.disablePackages(true);
    }

}

Lab.Packages();
Lab.Init();
if (window.location.search !== '') Lab.Load();
Lab.initExplorer(Lab.doc);
Lab.newPackages();
