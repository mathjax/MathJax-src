/*************************************************************
 *
 *  Copyright (c) 2019 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  The code that handles the v3-lab browser document
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */


import {MathJax as mathjax} from '../mathjax3/mathjax.js';
import '../mathjax3/util/asyncLoad/system.js';

import '../node_modules/mj-context-menu/dist/context_menu.js';

import {TeX} from '../mathjax3/input/tex.js';
import {ConfigurationHandler} from '../mathjax3/input/tex/Configuration.js';
import {MenuHandler} from '../mathjax3/ui/menu/MenuHandler.js';
import {Menu} from '../mathjax3/ui/menu/Menu.js';
import {STATE} from '../mathjax3/core/MathItem.js';

import {source} from '../components/src/source.js';


/*****************************************************************/

/**
 * A mixin to add complexity() to a document so that the checkboxes
 *   can control their functions.
 *
 * @param {Constructor<MathDocument>}    The document class to be extended
 * @returns {Constructor<MathDocument>}  The augmented class
 */
function V3DocumentMixin(documentClass) {

    return class extends documentClass {

        /**
         * Call the superclass' enrich() method depending on the checkbox settings.
         *
         * @override
         */
        enrich() {
            if (Lab.enrich) {
                super.enrich(true);
            }
            return this;
        }

        /**
         * Call the superclass' complexity() method depending on the checkbox settings.
         *
         * @override
         */
        complexity() {
            if (Lab.collapse || Lab.compute) {
                this.complexityVisitor.options.makeCollapsible = Lab.collapse;
                super.complexity(true);
            }
            return this;
        }

        /**
         * Rerender the math on the page using the Lab's Typeset() function
         *
         * @override
         */
        rerender() {
            Lab.Typeset();
            return this;
        }

    };
}

/*****************************************************************/

/**
 * The configuration object for loader/startup
 */
window.MathJax = {
    loader: {
        load: [
            'input/tex-full',
            'input/mml',
            'output/chtml'
        ],
        paths: {
            mathjax: './es5'
        },
        source: source,
        require: (url) => System.import(url)
    },
    options: {},
    startup: {
        input: ['tex', 'mml'],
        output: 'chtml',
        ready: () => Lab.Startup()
    },
    tex: {
        packages: ['base', 'autoload']
    },
    mml: {
        forceReparse: true
    }
};

/*****************************************************************/

/**
 * The object that manages the lab
 */
const Lab = window.Lab = {
    ready: false,                                 // true when everything is laoded and ready to go
    input: document.getElementById('input'),      // the input textarea
    output: document.getElementById('output'),    // where MathJax output will be displayed
    output2: document.getElementById('output2'),  // where second copy of MathJax output will be displayed
    mathml: document.getElementById('mathml'),    // where MathML output will be displayed
    display: true,                                // true when TeX input is in display mode
    showMML: false,                               // true when MathML output is to be shown
    showSecondOutput: false,                      // true when second output is to be shown
    enrich: false,                                // true when semantic enrichment is to be performed
    compute: false,                               // true when complexity should be computed
    collapse: false,                              // true when mactions should be inserted for complex math
    explore: false,                               // true when the explorer is enabled
    packages: {},                                 // the list of element ids for the TeX package checkboxes
    format: 'TeX',                                // the input format
    renderer: 'CHTML',                            // the output format
    doc: null,                                    // the current MathDocument
    mathItem: null,                               // a MathItem for the current display
    jax: {},                                      // an array of input jax objects
    tex: '',                                      // the saved input so we can switch back from MathML, if unchanged

    /*************************************************************/


    MathItem(input, output) {
        output.innerHTML = '';
        const text = output.appendChild(document.createTextNode(''));
        const math = this.mathItem = new this.doc.options.MathItem(input, this.jax[this.format], this.display);
        math.setMetrics(...this.metrics);
        math.start = {node: text, n: 0, delim: ''};
        math.end = {node: text, n: 0, delim: ''};
        return math;
    },

    /**
     * Perform the typesetting of the math in the proper format
     */
    Typeset() {
        this.doc = MathJax.startup.document;
        if (!this.ready || this.doc.menu.loading) return;

        //
        // Clear the old math and make a blank text node to use as the start/end node for the MathItem below
        //
        this.tex = '';

        //
        // Create a new MathItem from the input using the proper input jax and display mode,
        //   set its metrics, and link it to the text element created above, then
        //   add it to the document's math list.
        //
        this.mathItem = this.MathItem(this.input.value, this.output);
        this.doc.clear();
        this.doc.math.push(this.mathItem);

        if (this.showSecondOutput) {
          let math2 = this.MathItem(this.input.value, this.output2);
          this.doc.math.push(math2);
        } else {
          this.output2.innerHTML = '';
        }

        //
        // Reset the TeX numbering/labels, and clear the menu store
        //
        MathJax.texReset();
        this.doc.menu.clear();

        //
        // Typeset the math, and output the MathML
        //
        MathJax.typesetPromise().then(() => {
            this.doc = MathJax.startup.document;
            this.outputMML(Array.from(this.doc.math)[0]);
        }).catch(err => {
            console.log('Error: ' + (err.message || err));
            if (err.stack) console.log(err.stack);
        });
    },

    /**
     * Serialize the internal MathML, shortening data-semantic-* attributes for easier viewing,
     *  and output the results.
     */
    outputMML(math) {
        this.mathml.innerHTML = '';
        if (this.showMML && math.root) {
            const mml = this.doc.menu.toMML(math);
            this.mathml.appendChild(document.createTextNode(mml.replace(/data-semantic/g, 'DS')));
        }
    },

    /*************************************************************/

    /**
     * Record the current state in the URL and reload the page
     */
    Keep() {
        window.location.search = [
            '?',
            this.renderer.charAt(0),
            this.format.charAt(0),
            (this.display ? 1 : 0),
            (this.showMML ? 1 : 0),
            (this.showSecondOutput ? 1 : 0),
            (this.enrich ? 1 : 0),
            (this.compute ? 1 : 0),
            (this.collapse ? 1 : 0),
            (this.explore ? 1 : 0),
            this.getPackageFlags(),
            encodeURIComponent(this.input.value)
        ].join('');
    },

    /**
     * @returns {string}   A string of 1's and 0's indicating which packages are checked
     */
    getPackageFlags() {
        const keys = Object.keys(this.packages);
        return keys.map(key => document.getElementById(this.packages[key]).checked ? 1 : 0).join('');
    },

    /**
     * @returns {string[]}   An array of the packages that are checked
     */
    getPackages() {
        let result = [];
        for (let key in this.packages) {
            if (document.getElementById(this.packages[key]).checked) {
                result.push(key);
            }
        }
        return result;
    },

    /**
     * Create the checkbox elements for all the packages that are available
     */
    Packages() {
        let div = document.getElementById('package');
        for (let key of Array.from(ConfigurationHandler.keys()).sort()) {
            if (key === 'empty' || key === 'extension') {
                continue;
            }
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = key;
            checkbox.value = key;
            checkbox.id = 'package-' + key;
            checkbox.onchange = () => this.newPackages();
            if (MathJax.config.tex.packages.indexOf(key) >= 0) {
                checkbox.checked = true;
            }
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

    /**
     * Create a new TeX input jax for the given set of packages,
     *   and set its adaptor and mmlFactory, then use that jax
     *   for the input jax of the current document, and retypeset
     *   using the new set of packages.
     */
    newPackages() {
        this.jax.TeX = new TeX({packages: this.getPackages()});
        this.jax.TeX.setAdaptor(this.doc.adaptor);
        this.jax.TeX.setMmlFactory(this.doc.mmlFactory);
        if (this.format === 'TeX') {
            this.doc.inputJax = [this.jax.TeX];
            this.Typeset();
        }
    },

    /**
     * Disable/enable all the package checkboxes
     *
     * @param {boolean} disabled    True to disable, false to enable
     */
    disablePackages(disabled) {
        for (const input of document.querySelectorAll('#package input')) {
            input.disabled = disabled;
        }
    },
    
    /*************************************************************/

    /**
     * Sets the input format to the given type
     *
     * @param {value: string}    The input format (Display TeX, Inline TeX, or MathML)
     */
    setFormat(value) {
        const format = value.split(/ /);
        const changed = (this.format !== format[0]);
        if (changed) {
            //
            //  Attach the proper input jax to the current document
            //
            this.format = format[0];
            const jax = this.jax[this.format];
            this.doc.inputJax = [jax];
            jax.setAdaptor(this.doc.adaptor);
            jax.setMmlFactory(this.doc.mmlFactory);
        }
        let tex = '';
        if (format[0] === 'TeX') {
            //
            // Switch to TeX input by setting the display flag,
            //   enabling the package checkboxes and setting the
            //   input textarea to the original TeX (or blank)
            //
            this.display = format[1] === 'D';
            this.disablePackages(false);
            if (changed) {
                this.input.value = this.tex;
            }
        } else {
            //
            // Switch to MathML input by disabling the package checkboxes,
            //   saving the current TeX code for later, and using the
            //   serlialized internal MathML as the new input
            //
            this.disablePackages(true);
            tex = this.input.value;
            const mml = this.doc.menu.toMML(this.mathItem);
            this.input.value = mml.replace(/ data-semantic-\S+="[^"]*"/g, '');
        }
        this.Typeset();
        this.tex = tex;
    },

    /**
     * Set the output renderer to the given one
     *
     * @param {string} value   The renderer to select (CHTML or SVG)
     */
    setRenderer(value) {
        this.renderer = value;
        this.setVariable('renderer', value);
    },

    /**
     * Sets whether or not to show the internal MathML
     *
     * @param {boolean} checked   Whether to show the MathML or not (true = show)
     */
    setMathML(checked) {
        this.showMML = checked;
        this.Typeset();
    },

    /**
     * Sets whether or not to show the second copy of the MathJax output.  This
     * is useful for testing with tools that keep an internal state, like menu,
     * explorer etc. to verify that there are no interferences with multiple
     * math items in the page.
     *
     * @param {boolean} checked   Whether or not to show the second outputMathML.
     */
    setSecondOutput(checked) {
        this.showSecondOutput = checked;
        this.Typeset();
    },

    /**
     * Sets whether or not to enrich the MathML
     *
     * @param {boolean} checked   Whether to enrich or not (true = enrich)
     */
    setEnrich(checked) {
        this.enrich = checked;
        if (checked) {
            this.loadA11y('complexity');
            this.Typeset();
        } else {
            this.setVariable('collapsible', false, true);
            this.setVariable('explorer', false, true);
        }
    },

    /**
     * Sets whether or not to compute complexity values in the enriched MathML
     *
     * @param {boolean} checked   Whether to compute complexity or not (true = compute)
     */
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

    /**
     * Sets whether or not to add maction elements for complex math
     *
     * @param {boolean} checked   Whether to add mactions or not (true = add)
     */
    setCollapse(checked) {
        this.collapse = checked;
        if (checked) {
            this.setVariable('collapsible', true);
        } else {
            this.menuVariable('collapsible').setValue(false); // don't clear other a11y checkboxes
        }
    },

    /**
     * Sets whether or not to enable the Explorer module
     *
     * @param {boolean} checked   Whether to add the Explorer or not (true = add)
     */
    setExplorer(checked) {
        this.explore = checked;
        this.setVariable('explorer', checked);
    },

    /**
     * Loads an a11y module (complexity or explorer) if it hasn't already been loaded
     */
    loadA11y(component) {
        if (!MathJax._.a11y || !MathJax._.a11y[component]) {
            this.doc.menu.loadA11y(component);
        }
    },

    /*************************************************************/

    /**
     * Ask the output renderer to determine the measure the (font and container) metrics
     *   for the output area and save them to be used for the MathItems during typesetting.
     */
    initMetrics() {
        let {em, ex, containerWidth, lineWidth, scale} = MathJax.getMetricsFor(this.output);
        this.metrics = [em, ex, containerWidth, lineWidth, scale];
    },

    /**
     * Add callbacks to the menu items that need to be synchronized with checkboxes
     *   and set their values to correspond to the current state
     */
    initMenu() {
        this.setVariable('renderer', this.renderer, true);
        this.setVariable('collapsible', this.collapse, true);
        this.setVariable('explorer', this.explore, true);

        this.menuVariable('explorer').registerCallback(() => {
            this.explore = this.doc.menu.settings.explorer;
            document.getElementById('explore').checked = this.explore;
            if (this.explore) {
                this.enrich = true;
                document.getElementById('enrich').checked = true;
            }
            this.Typeset();
        });
        this.menuVariable('collapsible').registerCallback(() => {
            const checked = this.doc.menu.settings.collapsible;
            document.getElementById('collapse').checked = checked;
            this.compute = this.collapse = checked;
            document.getElementById('compute').checked = checked;
            if (checked || !this.doc.menu.settings.explorer) {
                this.enrich = checked;
                document.getElementById('enrich').checked = checked;
            }
            this.Typeset();
        });
        this.menuVariable('renderer').registerCallback(() => {
            this.renderer = this.doc.menu.settings.renderer;
            document.getElementById('renderer').value = this.renderer
        });
        this.menuVariable('semantics').registerCallback(() => this.outputMML(this.mathItem));
        this.menuVariable('texHints').registerCallback(() => this.outputMML(this.mathItem));
    },

    /**
     * Get a named variable object from the menu's variable pool
     *
     * @param {string} name    The name of the variable to get
     */
    menuVariable(name) {
        return this.doc.menu.menu.getPool().lookup(name);
    },

    /**
     * Set a menu variable and call its callbacks
     *
     * @param {string} name              The name of the variable to set
     * @param {string | boolean} value   The new value for the variable
     * @param {boolean} force            Whether to force the change (to run actions and callbacks)
     *                                     even if the value is already equal to the new value
     */
    setVariable(name, value, force) {
        if (value !== this.doc.menu.settings[name] || force) {
            const variable = this.menuVariable(name);
            variable.setValue(value);
            const item = variable.items[0];
            if (item) {
                item.executeCallbacks_();
            }
        }
    },

    /**
     * Augment a handler's document using the mixin for complexity() and explorable()
     *
     * @param {Handler} handler   The handler to be augmented
     */
    menuHandler(handler) {
        handler = MenuHandler(handler);
        handler.documentClass = V3DocumentMixin(handler.documentClass);
        return handler;
    },

    /*************************************************************/

    /**
     * Check a keypress in the input textarea to see if it should force
     *   typesetting (e.g., SHIFT-RETURN does this)
     *
     * @param {HTMLTextarea} textarea   The textarea node
     * @param {KeyEvent} event          The key event to check
     */
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

    /*************************************************************/

    /**
     * Initialize the lab once all the components have been loaded
     */
    Startup() {
        //
        //  Get the package list, and read any parameters from the URL
        //
        this.Packages();
        if (window.location.search !== '') this.Load();
        //
        // Extend the handler created by the startup module to include the menu handler
        //
        const startup = MathJax.startup;
        startup.extendHandler(handler => this.menuHandler(handler), 20);
        //
        // Transfer the checkbox information into the menu initialization
        //
        MathJax.config.options.menuOptions = {
            settings: {
                renderer: this.renderer,
                collapsible: this.collapse,
                explorer: this.explore
            }
        };
        //
        // Run the startup module's initialization
        //
        startup.getComponents();
        startup.makeMethods();
        //
        // Get the input jax and document that were created by the startup module,
        //   and add our hooks into the menu for synchronizing the checkboxes
        //
        this.jax = {
            TeX: startup.input[0],
            MathML: startup.input[1]
        };
        this.doc = startup.document;
        this.initMenu();
        //
        //  Initialize the rest of the lab
        //
        this.initMetrics();
        this.ready = true;
        this.newPackages();
        document.getElementById('keep').disabled = false;
        document.getElementById('typeset').disabled = false;
    },

    /**
     * Read the data stored in the URL and set the internal state and input elements
     *   to correspond to those values.
     */
    Load() {
        const data = decodeURIComponent(window.location.search.substr(1));
        const n = Lab.getPackageFlags().length;
        this.input.value = data.substr(n + 9).trim();
        this.explore = data.charAt(8) === '1';
        this.collapse = data.charAt(7) === '1';
        this.compute = data.charAt(6) === '1';
        this.enrich = data.charAt(5) === '1';
        this.showSecondOutput = data.charAt(4) === '1';
        this.showMML = data.charAt(3) === '1';
        this.display = data.charAt(2) === '1';
        this.format = {T: 'TeX', M: 'MathML'}[data.charAt(1)];
        this.renderer = {C: 'CHTML', S: 'SVG'}[data.charAt(0)];
        const format = this.format + (this.format === 'TeX' ? ' ' + (this.display ? 'D' : 'I') : '');
        document.getElementById('format').value = format;
        document.getElementById('renderer').value = this.renderer;
        document.getElementById('showMML').checked = this.showMML;
        document.getElementById('showSecondOutput').checked = this.showSecondOutput;
        document.getElementById('enrich').checked = this.enrich;
        document.getElementById('compute').checked = this.compute;
        document.getElementById('collapse').checked = this.collapse;
        document.getElementById('explore').checked = this.explore;
        const flags = data.substr(9,n);
        let i = 0;
        for (const key in Lab.packages) {
            document.getElementById(Lab.packages[key]).checked = (flags.charAt(i++) === '1');
        }
        if (this.format === 'MathML') Lab.disablePackages(true);
    }

    /*************************************************************/

};
