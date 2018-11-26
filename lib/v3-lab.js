import {MathJax} from '../mathjax3/mathjax.js';
import {TeX} from '../mathjax3/input/tex.js';
import {MathML} from '../mathjax3/input/mathml.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {SVG} from '../mathjax3/output/svg.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';
import {SerializedMmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';

import {ConfigurationHandler} from '../mathjax3/input/tex/Configuration.js';
import {AllPackages} from '../mathjax3/input/tex/AllPackages.js';

RegisterHTMLHandler(browserAdaptor());

const jax = {
    TeX: new TeX(),
 MathML: new MathML({forceReparse: true}),
  CHTML: new CHTML(),
    SVG: new SVG()
};

const docs = {
  CHTML: MathJax.document(document, {InputJax: jax.TeX, OutputJax: jax.CHTML}),
    SVG: MathJax.document(document, {InputJax: jax.TeX, OutputJax: jax.SVG})
};

const visitor = new SerializedMmlVisitor();
const toMml = (node => visitor.visitTree(node, Lab.doc.document));

const Lab = window.Lab = {
    input: document.getElementById('input'),
    output: document.getElementById('output'),
    mathml: document.getElementById('mathml'),
    display: true,
    showMML: false,
    packages: {},
    format: 'TeX',
    renderer: 'CHTML',
    doc: docs.CHTML,
    ijax: jax.TeX,
    ojax: jax.CHTML,
    mml: '',
    tex: '',
    
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
            this.outputMML(math);
            math.typeset(this.doc);
            math.updateDocument(this.doc);
        }.bind(this)).catch(err => {console.log("Error: " + err.message); console.log(err.stack)});
    },

    outputMML(math) {
        this.mml = toMml(math.root);
        this.mathml.innerHTML = '';
        if (this.showMML) {
            this.mathml.appendChild(document.createTextNode(this.mml));
        }
    },
    
    Keep() {
        window.location.search = [
            '?',
            this.renderer.charAt(0),
            this.format.charAt(0),
            (this.display ? 1 : 0),
            (this.showMML ? 1 : 0),
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
            docs.SVG.inputJax = [jax.TeX];
            this.ijax = jax.TeX;
        }
        Lab.Typeset();
    },

    disablePackages(disabled) {
        for (const input of document.querySelectorAll('#package input')) {
            input.disabled = disabled;
        }
        const packages = document.getElementById("package");
        if (disabled) {
            packages.classList.add("disabled");
        } else {
            packages.classList.remove("disabled");
        }
    },
    
    setFormat(value) {
        const format = value.split(/ /);
        const changed = (this.format !== format[0]);
        if (changed) {
            this.format = format[0];
            this.ijax = jax[this.format];
            docs.CHTML.inputJax = [this.ijax]
            docs.SVG.inputJax = [jax.ijax];
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
            this.input.value = this.mml;
        }
        this.Typeset();
        this.tex = tex;
    },
    
    setRenderer(value) {
        this.renderer = value;
        this.doc = docs[value];
        this.ojax = jax[value];
        this.Typeset();
    },
    
    setMathML(checked) {
        this.showMML = checked;
        this.Typeset();
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
    },
    
    Load() {
        const data = decodeURIComponent(window.location.search.substr(1));
        const n = Lab.getPackageFlags().length;
        this.input.value = data.substr(n + 4).trim();
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
        const flags = data.substr(4,n); 
        let i = 0;
        for (const key in Lab.packages) {
            if (flags.charAt(i++) === '1') {
                document.getElementById(Lab.packages[key]).checked = true;
            }
        }
    }

}

Lab.Packages();
Lab.Init();
if (window.location.search !== '') Lab.Load();
if (Lab.format === 'MathML') Lab.disablePackages(true);
Lab.newPackages();
