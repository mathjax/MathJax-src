import {MathJax as mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {ConfigurationHandler} from '../mathjax3/input/tex/Configuration.js';
import {AllPackages} from '../mathjax3/input/tex/AllPackages.js';
import {MenuHandler} from '../mathjax3/ui/menu/MenuHandler.js';
import {Menu} from '../mathjax3/ui/menu/Menu.js';

import {source} from '../components/src/source.js';


function V3DocumentMixin(documentClass) {
    return class extends documentClass {
        complexity() {
            if (Lab.collapse || Lab.compute) {
                this.complexityVisitor.options.makeCollapsible = Lab.collapse;
                const collapse = this.menu.settings.collapsible;
                this.menu.settings.collapsible = true;
                super.complexity();
                this.menu.settings.collapsible = collapse;
            } else if (Lab.enrich) {
                super.enrich();
            }
            return this;
        }

        explorable() {
            if (Lab.explore) {
                super.explorable();
            }
        }
    };
}

window.MathJax = {
    loader: {
        load: [
            'tex-input',
            'mml-input',
            'chtml-output'
        ],
        paths: {
            mathjax: './components/dist',
            node: './node_modules',
            sre: './lib'
        },
        dependencies: {
            'a11y/semantic-enrich': ['core', 'sre', 'mml-input'],
            'a11y/complexity': ['core', 'sre', 'mml-input'],
            'a11y/explorer': ['core', 'sre']
        },
        source: Object.assign(source, {
            sre: '[node]/speech-rule-engine/lib/sre_browser.js'
//            sre: '[sre]/sre_browser.js'
        }),
        require: (url) => System.import(url)
    },
    startup: {
        input: ['tex', 'mml'],
        output: 'chtml',
        ready: () => Lab.Startup()
    },
    options: {
        rerender: () => Lab.Typeset()
    },
    mml: {
        forceReparse: true
    },
    'a11y/complexity': {
        makeCollapsible: false
    }
};

const Lab = window.Lab = {
    ready: false,
    input: document.getElementById('input'),
    output: document.getElementById('output'),
    mathml: document.getElementById('mathml'),
    display: true,
    showMML: false,
    enrich: false,
    compute: false,
    collapse: false,
    explore: false,
    packages: {},
    format: 'TeX',
    renderer: 'CHTML',
    doc: null,
    mathItem: null,
    jax: {},
    mml: '',
    tex: '',
    
    Typeset() {
        this.doc = MathJax.startup.document;
        if (!this.ready || this.doc.menu.loading) return;
        this.tex = '';
        this.output.innerHTML = '';
        const text = this.output.appendChild(document.createTextNode(''));

        const input = this.input.value;
        const math = this.mathItem = new this.doc.options.MathItem(input, this.jax[this.format], this.display);
        math.setMetrics(...this.metrics);
        math.start = {node: text, n: 0, delim: ''};
        math.end = {node: text, n: 0, delim: ''};
        this.doc.clear();
        this.doc.math.push(math);

        MathJax.texReset();
        this.doc.menu.clear();

        MathJax.TypesetPromise().then(() => {
            this.outputMML(math);
        }).catch(err => {
            console.log('Error: ' + (err.message || err));
            if (err.stack) console.log(err.stack);
        });
    },

    outputMML(math) {
        this.mml = this.doc.menu.toMML(math);
        this.mathml.innerHTML = '';
        if (this.showMML) {
            this.mathml.appendChild(document.createTextNode(this.mml.replace(/data-semantic/g, 'DS')));
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
            checkbox.onchange = () => this.newPackages();
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
        this.jax.TeX = new TeX({packages: this.getPackages()});
        this.jax.TeX.setAdaptor(this.doc.adaptor);
        this.jax.TeX.setMmlFactory(this.doc.mmlFactory);
        if (this.format === 'TeX') {
            this.doc.inputJax = [this.jax.TeX];
        }
        this.Typeset();
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
            const jax = this.jax[this.format];
            this.doc.inputJax = [jax];
            jax.setAdaptor(this.doc.adaptor);
            jax.setMmlFactory(this.doc.mmlFactory);
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
        this.setVariable('renderer', value);
    },
    
    setMathML(checked) {
        this.showMML = checked;
        this.Typeset();
    },
    
    setEnrich(checked) {
        this.enrich = checked;
        if (checked) {
            this.loadA11y('complexity');
            this.Typeset();
        } else {
            this.setVariable('collapsible', false);
        }
    },

    setCompute(checked) {
        this.compute = checked;
        if (checked) {
            this.enrich = true;
            document.getElementById('enrich').checked = true;
            this.loadA11y('complexity');
            this.Typeset();
        } else {
            this.collapse = false;
            document.getElementById('collapse').checked = false;
            this.menuVariable('collapsible').setValue(false); // don't clear other a11y checkboxes
        }
    },

    setCollapse(checked) {
        this.collapse = checked;
        if (checked) {
            this.setVariable('collapsible', true);
        } else {
            this.menuVariable('collapsible').setValue(false); // don't clear other a11y checkboxes
        }
    },

    setExplorer(checked) {
        this.explore = checked;
        this.setVariable('explorer', checked);
    },

    loadA11y(component) {
        if (!MathJax._.a11y || !MathJax._.a11y.complexity) {
            this.doc.menu.loadA11y(component);
        }
    },

    initMenu() {
        const collapsible = 
        this.menuVariable('explorer').registerCallback(() => {
            document.getElementById('explore').checked = this.doc.menu.settings.explorer;
        });
        this.menuVariable('collapsible').registerCallback(() => {
            const checked = this.doc.menu.settings.collapsible;
            document.getElementById('collapse').checked = checked;
            this.enrich = this.compute = this.collapse = checked;
            document.getElementById('enrich').checked = checked;
            document.getElementById('compute').checked = checked;
            this.Typeset();
        });
        this.menuVariable('renderer').registerCallback(() => {
            document.getElementById('renderer').value = this.doc.menu.settings.renderer;
        });
        this.menuVariable('semantics').registerCallback(() => this.outputMML(this.mathItem));
        this.menuVariable('texHints').registerCallback(() => this.outputMML(this.mathItem));

        this.setVariable('renderer', this.doc.menu.settings.renderer, this.renderer);
        this.setVariable('collapsible', this.doc.menu.settings.collapsible, this.collapse);
        this.setVariable('explorer', this.doc.menu.settings.explorer, this.explore);
    },
    
    menuVariable(name) {
        return this.doc.menu.menu.getPool().lookup(name);
    },

    menuHandler(handler) {
        handler = MenuHandler(handler);
        handler.documentClass = V3DocumentMixin(handler.documentClass);
        return handler;
    },

    setVariable(name, value, check) {
        if (check === undefined) {
            check = this.doc.menu.settings[name];
        }
        if (value !== check) {
            const variable = this.menuVariable(name);
            variable.setValue(value);
            const item = variable.items[0];
            if (item) {
                item.executeCallbacks_();
            }
        }
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

    Startup() {
        const startup = MathJax.startup;
        startup.extendHandler(handler => this.menuHandler(handler), 20);
        startup.typesetCall('addMenu', 140);
        startup.getComponents();
        startup.makeMethods();
        this.jax = {
            TeX: startup.input[0],
            MathML: startup.input[1]
        };
        this.doc = startup.document;
        this.Init();
    },

    Init() {
        this.Packages();
        let test = this.doc.outputJax.getTestElement(this.output);
        let {em, ex, containerWidth, lineWidth, scale} = this.doc.outputJax.measureMetrics(test);
        this.metrics = [em, ex, containerWidth, lineWidth, scale];
        this.output.removeChild(test);
        if (window.location.search !== '') this.Load();
        this.newPackages();
        this.initMenu();
        this.ready = true;
        this.Typeset();
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
        const format = this.format + (this.format === 'TeX' ? ' ' + (this.display ? 'D' : 'I') : '');
        document.getElementById('format').value = format;
        document.getElementById('renderer').value = this.renderer;
        document.getElementById('showMML').checked = this.showMML;
        document.getElementById('enrich').checked = this.enrich;
        document.getElementById('compute').checked = this.compute;
        document.getElementById('collapse').checked = this.collapse;
        document.getElementById('explore').checked = this.explore;
        if (this.enrich) this.loadA11y('complexity');
        if (this.explore) this.loadA11y('explorer');
        const flags = data.substr(8,n); 
        let i = 0;
        for (const key in Lab.packages) {
            if (flags.charAt(i++) === '1') {
                document.getElementById(Lab.packages[key]).checked = true;
            }
        }
        if (this.format === 'MathML') Lab.disablePackages(true);
    }

};
