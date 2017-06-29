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
 * @fileoverview  Implements the interface and abstract class for MathDocument objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {userOptions, defaultOptions, OptionList} from '../util/Options.js';
import {InputJax, AbstractInputJax} from './InputJax.js';
import {OutputJax, AbstractOutputJax} from './OutputJax.js';
import {MathList, AbstractMathList} from './MathList.js';
import {MathItem, AbstractMathItem} from './MathItem.js';
import {MmlNode} from './MmlTree/MmlNode.js';
import {MmlFactory} from '../core/MmlTree/MmlFactory.js';

/*****************************************************************/
/*
 *  The MathDocument interface
 *
 *  The MathDocument is created by MathJax.Document() and holds the
 *  document, the math found in it, and so on.  The methods of the
 *  MathDocument all return the MathDocument itself, so you can
 *  chain the method calls.  E.g.,
 *
 *    const html = MathJax.Document('<html>...</html>');
 *    html.findMath()
 *        .compile()
 *        .getMetrics()
 *        .typeset()
 *        .addEventHandlers()
 *        .updateDocument();
 *
 *  The MathDocument is the main interface for page authors to
 *  interact with MathJax.
 */

export interface MathDocument {
    /*
     * The document being processed (e.g., DOM document, or Markdown string)
     */
    document: any;

    /*
     * The kind of MathDocument (e.g., "HTML")
     */
    kind: string;

    /*
     * The options for the document
     */
    options: OptionList;

    /*
     * The list of MathItems found in this page
     */
    math: MathList;

    /*
     * This object tracks what operations have been performed, so that (when
     *  asynchronous operations are used), the ones that have already been
     *  completed won't be performed again.
     */
    processed: {[name: string]: boolean};

    /*
     * An array of input jax to run on the document
     */
    inputJax: InputJax[];

    /*
     * The output jax to use for the document
     */
    outputJax: OutputJax;

    /*
     * Locates the math in the document and constructs the MathList
     *  for the document.
     *
     * @param{OptionList} options  The options for locating the math
     * @return{MathDocument}       The math document instance
     */
    findMath(options?: OptionList): MathDocument;

    /*
     * Calls the input jax to process the MathItems in the MathList
     *
     * @return{MathDocument}  The math document instance
     */
    compile(): MathDocument;

    /*
     * Gets the metric information for the MathItems
     *
     * @return{MathDocument}  The math document instance
     */
    getMetrics(): MathDocument;

    /*
     * Calls the output jax to process the compiled math in the MathList
     *
     * @return{MathDocument}  The math document instance
     */
    typeset(): MathDocument;

    /*
     * Add any event handlers to the typeset math
     *
     * @return{MathDocument}  The math document instance
     */
    addEventHandlers(): MathDocument;

    /*
     * Updates the document to include the typeset math
     *
     * @return{MathDocument}  The math document instance
     */
    updateDocument(): MathDocument;

    /*
     * Removes the typeset math from the document
     *
     * @param{boolean} restore  True if the original math should be put
     *                            back into the document as well
     * @return{MathDocument}    The math document instance
     */
    removeFromDocument(restore?: boolean): MathDocument;

    /*
     * Set the state of the document (allowing you to roll back
     *  the state to a previous one, if needed).
     *
     * @param{boolean} restore  True if the original math should be put
     *                            back into the document during the rollback
     * @return{MathDocument}    The math document instance
     */
    state(state: number, restore?: boolean): MathDocument;

    /*
     * Clear the processed values so that the document can be reprocessed
     *
     * @return{MathDocument}  The math document instance
     */
    reset(): MathDocument;

    /*
     * Reset the processed values and clear the MathList (so that new math
     * can be processed in the document).
     *
     * @return{MathDocument}  The math document instance
     */
    clear(): MathDocument;

    /*
     * Merges a MathList into the list for this document.
     *
     * @param{MathList} list   The MathList to be merged into this document's list
     * @return{MathDocument}   The math document instance
     */
    concat(list: MathList): MathDocument;

}

/*****************************************************************/
/*
 *  The booleans used to keep track of what processing has been
 *  performed.
 */

export type MathProcessed = {
    findMath: boolean;
    compile: boolean;
    getMetrics: boolean;
    typeset: boolean;
    addEventHandlers: boolean;
    updateDocument: boolean;
    [name: string]: boolean;
}

/*
 * Defaults used when input and output jax aren't specified
 */
class DefaultInputJax extends AbstractInputJax {
    compile(math: MathItem) {
        return null as MmlNode;
    }
}
class DefaultOutputJax extends AbstractOutputJax {
    typeset(math: MathItem, document: MathDocument = null) {
        return null as Element;
    }
    escaped(math: MathItem, document?: MathDocument) {
        return null as Element;
    }
}
class DefaultMathList extends AbstractMathList {}

let errorFactory = new MmlFactory();


/*****************************************************************/
/*
 *  Implements the abstract MathDocument class
 */

export abstract class AbstractMathDocument implements MathDocument {

    public static KIND: string = 'MathDocument';
    public static OPTIONS: OptionList = {
        OutputJax: null,           // instance of an OutputJax for the document
        InputJax: null,            // instance of in InputJax or an array of them
        MathList: DefaultMathList, // class to use for the MathList
        compileError: (doc: AbstractMathDocument, math: MathItem, err: Error) => {
            doc.compileError(math, err);
        },
        typesetError: (doc: AbstractMathDocument, math: MathItem, err: Error) => {
            doc.typesetError(math, err);
        }
    };
    public static STATE = AbstractMathItem.STATE;

    public document: any;
    public options: OptionList;
    public math: MathList;
    public processed: MathProcessed;
    public inputJax: InputJax[];
    public outputJax: OutputJax;

    /*
     * @param{any} document        The document (HTML string, parsed DOM, etc.) to be processed
     * @param{OptionList} options  The options for this document
     * @constructor
     */
    constructor (document: any, options: OptionList) {
        let CLASS = this.constructor as typeof AbstractMathDocument;
        this.document = document;
        this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
        this.math = new (this.options['MathList'] as typeof DefaultMathList)();
        this.processed = {
            findMath: false,
            compile: false,
            typeset: false,
            getMetrics: false,
            addEventHandlers: false,
            updateDocument: false
        };
        this.outputJax = this.options['OutputJax'] || new DefaultOutputJax();
        let inputJax = this.options['InputJax'] || [new DefaultInputJax()];
        if (!Array.isArray(inputJax)) {
            inputJax = [inputJax];
        }
        this.inputJax = inputJax;
    }

    /*
     * @return{string}  The kind of document
     */
    public get kind() {
        return (this.constructor as typeof AbstractMathDocument).KIND;
    }

    /*
     * @override
     */
    public findMath(options: OptionList = null) {
        this.processed.findMath = true;
        return this;
    }

    /*
     * @override
     */
    public compile() {
        if (!this.processed.compile) {
            for (const math of this.math) {
                try {
                    math.compile(this);
                } catch (err) {
                    if (err.retry || err.restart) {
                        throw err;
                    }
                    this.options['compileError'](this, math, err);
                    math.inputData['error'] = err;
                }
            }
            this.processed.compile = true;
        }
        return this;
    }

    /*
     * Produce an error using MmlNodes
     *
     * @param{MathItem} math  The MathItem producing the error
     * @param{Error} err      The Error object for the error
     */
    public compileError(math: MathItem, err: Error) {
        math.root = errorFactory.create('math', {'data-mjx-error': err.message}, [
            errorFactory.create('merror', null, [
                errorFactory.create('mtext', null, [
                    errorFactory.create('text').setText('Math input error')
                ])
            ])
        ]);
        if (math.display) {
            math.root.attributes.set('display', 'block');
        }
    }

    /*
     * @override
     */
    public typeset() {
        if (!this.processed.typeset) {
            for (const math of this.math) {
                try {
                    math.typeset(this);
                } catch (err) {
                    if (err.retry || err.restart) {
                        throw err;
                    }
                    this.options['typesetError'](this, math, err);
                    math.outputData['error'] = err;
                }
            }
            this.processed.typeset = true;
        }
        return this;
    }

    /*
     * Produce an error using HTML
     *
     * @param{MathItem} math  The MathItem producing the error
     * @param{Error} err      The Error object for the error
     */
    public typesetError(math: MathItem, err: Error) {
        let error = this.document.createElement('span');
        error.setAttribute('data-mjx-error',err.message);
        error.appendChild(this.document.createTextNode('Math output error'));
        math.typesetRoot = error;
    }

    /*
     * @override
     */
    public getMetrics() {
        if (!this.processed.getMetrics) {
            this.outputJax.getMetrics(this);
            this.processed.getMetrics = true;
        }
        return this;
    }

    /*
     * @override
     */
    public addEventHandlers() {
        this.processed.addEventHandlers = true;
        return this;
    }

    /*
     * @override
     */
    public updateDocument() {
        if (!this.processed.updateDocument) {
            for (const math of this.math.reversed()) {
                math.updateDocument(this);
            }
            this.processed.updateDocument = true;
        }
        return this;
    }

    /*
     * @override
     */
    public removeFromDocument(restore: boolean = false) {
        return this;
    }

    /*
     * @override
     */
    public state(state: number, restore: boolean = false) {
        for (const math of this.math) {
            math.state(state, restore);
        }
        if (state < STATE.INSERTED) {
            this.processed.updateDocument = false;
        }
        if (state < STATE.TYPESET) {
            this.processed.typeset = false;
            this.processed.addEventHandlers = false;
            this.processed.getMetrics = false;
        }
        if (state < STATE.COMPILED) {
            this.processed.compile = false;
        }
        return this;
    }

    /*
     * @override
     */
    public reset() {
        for (const key of Object.keys(this.processed)) {
            this.processed[key] = false;
        }
        return this;
    }

    /*
     * @override
     */
    public clear() {
        this.reset();
        this.math.clear();
        return this;
    }

    /*
     * @override
     */
    public concat(list: MathList) {
        this.math.merge(list);
        return this;
    }

}

let STATE = AbstractMathDocument.STATE;
