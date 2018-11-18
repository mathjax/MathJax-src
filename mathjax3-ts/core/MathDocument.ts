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
import {MmlNode, TextNode} from './MmlTree/MmlNode.js';
import {MmlFactory} from '../core/MmlTree/MmlFactory.js';
import {DOMAdaptor} from '../core/DOMAdaptor.js';
import {BitField, BitFieldClass} from '../util/BitField.js';

/*****************************************************************/
/**
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
 *        .updateDocument();
 *
 *  The MathDocument is the main interface for page authors to
 *  interact with MathJax.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface MathDocument<N, T, D> {
    /**
     * The document being processed (e.g., DOM document, or Markdown string)
     */
    document: D;

    /**
     * The kind of MathDocument (e.g., "HTML")
     */
    kind: string;

    /**
     * The options for the document
     */
    options: OptionList;

    /**
     * The list of MathItems found in this page
     */
    math: MathList<N, T, D>;

    /**
     * This object tracks what operations have been performed, so that (when
     *  asynchronous operations are used), the ones that have already been
     *  completed won't be performed again.
     */
    processed: BitField;

    /**
     * An array of input jax to run on the document
     */
    inputJax: InputJax<N, T, D>[];

    /**
     * The output jax to use for the document
     */
    outputJax: OutputJax<N, T, D>;

    /**
     * The DOM adaotor to use for input and output
     */
    adaptor: DOMAdaptor<N, T, D>;

    /**
     * The MmlFactory to be used for input jax and error processing
     */
    mmlFactory: MmlFactory;

    /**
     * Locates the math in the document and constructs the MathList
     *  for the document.
     *
     * @param {OptionList} options  The options for locating the math
     * @return {MathDocument}       The math document instance
     */
    findMath(options?: OptionList): MathDocument<N, T, D>;

    /**
     * Calls the input jax to process the MathItems in the MathList
     *
     * @return {MathDocument}  The math document instance
     */
    compile(): MathDocument<N, T, D>;

    /**
     * Gets the metric information for the MathItems
     *
     * @return {MathDocument}  The math document instance
     */
    getMetrics(): MathDocument<N, T, D>;

    /**
     * Calls the output jax to process the compiled math in the MathList
     *
     * @return {MathDocument}  The math document instance
     */
    typeset(): MathDocument<N, T, D>;

    /**
     * Updates the document to include the typeset math
     *
     * @return {MathDocument}  The math document instance
     */
    updateDocument(): MathDocument<N, T, D>;

    /**
     * Removes the typeset math from the document
     *
     * @param {boolean} restore  True if the original math should be put
     *                            back into the document as well
     * @return {MathDocument}    The math document instance
     */
    removeFromDocument(restore?: boolean): MathDocument<N, T, D>;

    /**
     * Set the state of the document (allowing you to roll back
     *  the state to a previous one, if needed).
     *
     * @param {boolean} restore  True if the original math should be put
     *                            back into the document during the rollback
     * @return {MathDocument}    The math document instance
     */
    state(state: number, restore?: boolean): MathDocument<N, T, D>;

    /**
     * Clear the processed values so that the document can be reprocessed
     *
     * @return {MathDocument}  The math document instance
     */
    reset(): MathDocument<N, T, D>;

    /**
     * Reset the processed values and clear the MathList (so that new math
     * can be processed in the document).
     *
     * @return {MathDocument}  The math document instance
     */
    clear(): MathDocument<N, T, D>;

    /**
     * Merges a MathList into the list for this document.
     *
     * @param {MathList} list   The MathList to be merged into this document's list
     * @return {MathDocument}   The math document instance
     */
    concat(list: MathList<N, T, D>): MathDocument<N, T, D>;

}

/*****************************************************************/

/**
 * Defaults used when input jax isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultInputJax<N, T, D> extends AbstractInputJax<N, T, D> {
    /**
     * @override
     */
    public compile(math: MathItem<N, T, D>) {
        return null as MmlNode;
    }
}
/**
 * Defaults used when ouput jax isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultOutputJax<N, T, D> extends AbstractOutputJax<N, T, D> {
    /**
     * @override
     */
    public typeset(math: MathItem<N, T, D>, document: MathDocument<N, T, D> = null) {
        return null as N;
    }
    public escaped(math: MathItem<N, T, D>, document?: MathDocument<N, T, D>) {
        return null as N;
    }
}
/**
 * Default for the MathList when one isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultMathList<N, T, D> extends AbstractMathList<N, T, D> {}
/**
 * Default for the Mathitem when one isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultMathItem<N, T, D> extends AbstractMathItem<N, T, D> {}

/*****************************************************************/
/**
 *  Implements the abstract MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export abstract class AbstractMathDocument<N, T, D> implements MathDocument<N, T, D> {

    public static KIND: string = 'MathDocument';
    public static OPTIONS: OptionList = {
        OutputJax: null,           // instance of an OutputJax for the document
        InputJax: null,            // instance of an InputJax or an array of them
        MmlFactory: null,          // instance of a MmlFactory for this document
        MathList: DefaultMathList, // constructor for a MathList to use for the document
        MathItem: DefaultMathItem, // constructor for a MathItem to use for the MathList
        compileError: (doc: AbstractMathDocument<any, any, any>, math: MathItem<any, any, any>, err: Error) => {
            doc.compileError(math, err);
        },
        typesetError: (doc: AbstractMathDocument<any, any, any>, math: MathItem<any, any, any>, err: Error) => {
            doc.typesetError(math, err);
        }
    };
    public static STATE = AbstractMathItem.STATE;

    /**
     * A bit-field for the actions that heve been processed
     */
    public static ProcessBits = BitFieldClass('findMath', 'compile', 'getMetrics', 'typeset', 'updateDocument');

    public document: D;
    public options: OptionList;
    public math: MathList<N, T, D>;
    public processed: BitField;
    public inputJax: InputJax<N, T, D>[];
    public outputJax: OutputJax<N, T, D>;
    public adaptor: DOMAdaptor<N, T, D>;
    public mmlFactory: MmlFactory;


    /**
     * @param {any} document           The document (HTML string, parsed DOM, etc.) to be processed
     * @param {DOMAdaptor} adaptor     The DOM adaptor for this document
     * @param {OptionList} options     The options for this document
     * @constructor
     */
    constructor (document: any, adaptor: DOMAdaptor<N, T, D>, options: OptionList) {
        let CLASS = this.constructor as typeof AbstractMathDocument;
        this.document = document;
        this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
        this.math = new (this.options['MathList'] || DefaultMathList)();
        this.processed = new AbstractMathDocument.ProcessBits();
        this.outputJax = this.options['OutputJax'] || new DefaultOutputJax<N, T, D>();
        let inputJax = this.options['InputJax'] || [new DefaultInputJax<N, T, D>()];
        if (!Array.isArray(inputJax)) {
            inputJax = [inputJax];
        }
        this.inputJax = inputJax;
        //
        // Pass the DOM adaptor to the jax
        //
        this.adaptor = adaptor;
        this.outputJax.setAdaptor(adaptor);
        this.inputJax.map(jax => jax.setAdaptor(adaptor));
        //
        // Pass the MmlFactory to the jax
        //
        this.mmlFactory = this.options['MmlFactory'] || new MmlFactory();
        this.inputJax.map(jax => jax.setMmlFactory(this.mmlFactory));
    }

    /**
     * @return {string}  The kind of document
     */
    public get kind() {
        return (this.constructor as typeof AbstractMathDocument).KIND;
    }

    /**
     * @override
     */
    public findMath(options: OptionList = null) {
        this.processed.set('findMath');
        return this;
    }

    /**
     * @override
     */
    public compile() {
        if (!this.processed.isSet('compile')) {
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
            this.processed.set('compile');
        }
        return this;
    }

    /**
     * Produce an error using MmlNodes
     *
     * @param {MathItem} math  The MathItem producing the error
     * @param {Error} err      The Error object for the error
     */
    public compileError(math: MathItem<N, T, D>, err: Error) {
        math.root = this.mmlFactory.create('math', {'data-mjx-error': err.message}, [
            this.mmlFactory.create('merror', null, [
                this.mmlFactory.create('mtext', null, [
                    (this.mmlFactory.create('text') as TextNode).setText('Math input error')
                ])
            ])
        ]);
        if (math.display) {
            math.root.attributes.set('display', 'block');
        }
    }

    /**
     * @override
     */
    public typeset() {
        if (!this.processed.isSet('typeset')) {
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
            this.processed.set('typeset');
        }
        return this;
    }

    /**
     * Produce an error using HTML
     *
     * @param {MathItem} math  The MathItem producing the error
     * @param {Error} err      The Error object for the error
     */
    public typesetError(math: MathItem<N, T, D>, err: Error) {
        math.typesetRoot = this.adaptor.node('span',
                                             {'data-mjx-error': err.message},
                                             [this.adaptor.text('Math output error')]);
    }

    /**
     * @override
     */
    public getMetrics() {
        if (!this.processed.isSet('getMetrics')) {
            this.outputJax.getMetrics(this);
            this.processed.set('getMetrics');
        }
        return this;
    }

    /**
     * @override
     */
    public updateDocument() {
        if (!this.processed.isSet('updateDocument')) {
            for (const math of this.math.reversed()) {
                math.updateDocument(this);
            }
            this.processed.set('updateDocument');
        }
        return this;
    }

    /**
     * @override
     */
    public removeFromDocument(restore: boolean = false) {
        return this;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
        for (const math of this.math) {
            math.state(state, restore);
        }
        if (state < STATE.INSERTED) {
            this.processed.clear('updateDocument');
        }
        if (state < STATE.TYPESET) {
            this.processed.clear('typeset');
            this.processed.clear('getMetrics');
        }
        if (state < STATE.COMPILED) {
            this.processed.clear('compile');
        }
        return this;
    }

    /**
     * @override
     */
    public reset() {
        this.processed.reset();
        return this;
    }

    /**
     * @override
     */
    public clear() {
        this.reset();
        this.math.clear();
        return this;
    }

    /**
     * @override
     */
    public concat(list: MathList<N, T, D>) {
        this.math.merge(list);
        return this;
    }

}

let STATE = AbstractMathDocument.STATE;

/**
 * The constructor type for a MathDocument
 */
export type MathDocumentConstructor<N, T, D> = {
    new (document: any, adaptor: DOMAdaptor<N, T, D>, options: OptionList): AbstractMathDocument<N, T, D>;
};
