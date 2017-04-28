/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the MathML InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractInputJax} from '../core/InputJax.js';
import {DefaultOptions, SeparateOptions, OptionList} from '../util/Options.js';
import {FunctionList} from '../util/FunctionList.js';
import {MathItem, ProtoItem} from '../core/MathItem.js';
import {DOM} from '../util/DOM.js';

import {FindMathML} from './mathml/FindMathML.js';
import {MathMLCompile} from './mathml/MathMLCompile.js';

/*****************************************************************/
/*
 *  Implements the MathML class (extends AbstractInputJax)
 */

export class MathML extends AbstractInputJax {

    public static NAME: string = 'MathML';
    public static OPTIONS: OptionList = DefaultOptions({
        parseAs: 'html',         // Whether to use HTML or XML parsing for the MathML string
        forceReparse: false,     // Whether to force the string to be reparsed, or use the one from the document DOM
        FindMathML: null,        // The FindMathML instance to override the default one
        MathMLCompile: null,     // The MathMLCompile instnace to override the default one
        DOMParser: null,         // The DOMParser class to override the default one
        /*
         * The function to use to handle a parsing error (throw an error by default)
         */
        parseError: function (node: Element) {
            this.Error(node.textContent.replace(/\n.*/g, ''));
        }
    }, AbstractInputJax.OPTIONS);

    /*
     * The FindMathML instance used to locate MathML in the document
     */
    protected FindMathML: FindMathML;

    /*
     * The MathMLCompile instance used to convert the MathML tree to internal format
     */
    protected MathML: MathMLCompile;

    /*
     * The DOMParser instance used to parse the MathML string
     */
    protected parser: DOMParser;

    /*
     * A list of functions to call on the parsed MathML DOM before conversion to internal structure
     */
    protected mmlFilters: FunctionList;

    /*
     * @override
     */
    constructor(options: OptionList = {}) {
        let [mml, find, compile] = SeparateOptions(options, FindMathML.OPTIONS, MathMLCompile.OPTIONS);
        super(mml);
        this.FindMathML = this.options['FindMathML'] || new FindMathML(find);
        this.MathML = this.options['MathMLCompile'] || new MathMLCompile(compile);
        this.parser = this.options['DOMParser'] || new (DOM.DOMParser)();
        this.mmlFilters = new FunctionList();
    }

    /*
     * Don't process strings (process nodes)
     *
     * @override
     */
    public get processStrings() {
        return false;
    }

    /*
     * Convert a MathItem to internal format:
     *   If there is no existing MathML node, or we are asked to reparse everything
     *     Execute the preFilters on the math
     *     Parse the MathML string in the desired format, and check the result for errors
     *     If we got an HTML document:
     *       Check that it has only one child (the <math> element), and use it
     *     Otherwise
     *       Use the root element from the XML document
     *     If the node is not a <math> node, report the error.
     *   Execute the mmlFilters on teh parsed MathML
     *   Compile the MathML to internal format, and execute the postFilters
     *   Return the resulting internal format
     *
     * @override
     */
    public Compile(math: MathItem) {
        let mml = math.start.node;
        if (!mml || this.options['forceReparse']) {
            let mathml = this.executeFilters(this.preFilters, math, math.math || '<math></math>');
            let doc = this.parser.parseFromString(mathml, 'text/' + this.options['parseAs']);
            doc = this.checkForErrors(doc);
            if (doc.body) {
                if (doc.body.childNodes.length !== 1) {
                    this.Error('MathML must consist of a single element');
                }
                mml = doc.body.removeChild(doc.body.firstChild) as Element;
            } else {
                mml = doc.removeChild(doc.firstChild) as Element;
            }
            if (mml.nodeName.toLowerCase().replace(/^[a-z]+:/, '') !== 'math') {
                this.Error('MathML must be formed by a <math> element, not <' +
                           mml.nodeName.toLowerCase() + '>');
            }
        }
        mml = this.executeFilters(this.mmlFilters, math, mml);
        return this.executeFilters(this.postFilters, math, this.MathML.Compile(mml as HTMLElement));
    }

    /*
     * Check a parsed MathML string for errors.
     *
     * @param{Document} doc  The document returns from the DOMParser
     * @return{Document}     The document
     */
    protected checkForErrors(doc: Document) {
        let err = doc.querySelector('parsererror');
        if (err) {
            if (err.textContent === '') {
                this.Error('Error processing MathML');
            }
            this.options['parseError'].call(this, err);
        }
        return doc;
    }

    /*
     * Throw an error
     *
     * @param{string} message  The error message to produce
     */
    protected Error(message: string) {
        // FIXME:  should this be creating merror nodes instead?
        throw new Error(message);
    }

    /*
     * @override
     */
    public FindMath(node: Element) {
        return this.FindMathML.FindMath(node);
    }

}
