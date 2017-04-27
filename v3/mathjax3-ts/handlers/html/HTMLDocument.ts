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
 * @fileoverview  Implements the HTMLDocument class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathDocument, AbstractMathDocument} from '../../core/MathDocument.js';
import {UserOptions, SeparateOptions, OptionList} from '../../util/Options.js';
import {HTMLMathItem} from './HTMLMathItem.js';
import {HTMLMathList} from './HTMLMathList.js';
import {HTMLDomStrings} from './HTMLDomStrings.js';
import {InputJax} from '../../core/InputJax.js';
import {MathItem, ProtoItem, Location} from '../../core/MathItem.js';

/*****************************************************************/
/*
 * List of List of pairs consisting of a DOM node and its text length
 *
 * These represent the Text elements that make up a single
 * string in the list of strings to be searched for math
 * (multiple consecutive Text nodes can form a single string).
 */
export type HTMLNodeArray = [Element, number][][];

/*****************************************************************/
/*
 *  The HTMLDocument class (extends AbstractMathDocument)
 */

export class HTMLDocument extends AbstractMathDocument {

    public static KIND: string = 'HTML';
    public static OPTIONS: OptionList = {
        ...AbstractMathDocument.OPTIONS,
        MathList: HTMLMathList,           // Use the HTMLMathList for Mathlists
        DomStrings: null                  // Use the default DomString parser
    };
    public static STATE = AbstractMathDocument.STATE;

    /*
     * The DomString parser for locating the text in DOM trees
     */
    public DomStrings: HTMLDomStrings;

    /*
     * @override
     * @constructor
     * @extends{AbstractMathDocument}
     */
    constructor(document: any, options: OptionList) {
        let [html, dom] = SeparateOptions(options, HTMLDomStrings.OPTIONS);
        super(document, html);
        this.DomStrings = this.options['DomStrings'] || new HTMLDomStrings(dom);
    }

    /*
     * Creates a Location object for a delimiter at the position given by index in the N's string
     *  of the array of strings searched for math, recovering the origin DOM node where the delimiter
     *  was found.
     *
     * @param{number} N             The index of the string in the string array
     * @param{number} index         The position within the N's string that needs to be found
     * @param{string} delim         The delimiter for this position
     * @param{HTMLNodeArray} nodes  The list of node lists representing the string array
     * @return{Location}            The Location object for the position of the delimiter in the document
     */
    protected FindPosition(N: number, index: number, delim: string, nodes: HTMLNodeArray): Location {
        for (const list of nodes[N]) {
            let [node, n] = list;
            if (index <= n) {
                return {node: node, n: index, delim: delim};
            } else {
                index -= n;
            }
        }
        return {node: null, n: 0, delim: delim};
    }

    /*
     * Convert a ProtoItem to a MathItem (i.e., determine the actual Location
     *  objects for its start and end)
     *
     * @param{ProtoItem} item       The proto math item to turn into an actual MathItem
     * @param{InputJax} jax         The input jax to use for the MathItem
     * @param{HTMLNodeArray} nodes  The array of node lists that produced the string array
     * @return{HTMLMathItem}        The MathItem for the given proto item
     */
    protected MathItem(item: ProtoItem, jax: InputJax, nodes: HTMLNodeArray) {
        let math = item.math;
        let start = this.FindPosition(item.n, item.start.n, item.open, nodes);
        let end = this.FindPosition(item.n, item.end.n, item.close, nodes);
        return new HTMLMathItem(math, jax, item.display, start, end);
    }

    /*
     * Get a list of containers (DOM nodes) to be searched for math.  These can be
     *  specified by CSS selector, or as actual DOM elements or arrays of such.
     *
     * @param{(string | Element | Element[])[]} nodes  The array of items to make into a container list
     * @param{Document} document                       The document in which to search
     * @return{Element[]}                              The array of containers to search
     */
    protected getElements(nodes: (string | Element | Element[])[], document: Document) {
        let containers: Element[] = [];
        for (const node of nodes) {
            if (typeof(node) === 'string') {
                containers = containers.concat(Array.from(document.querySelectorAll(node)));
            } else if (Array.isArray(node)) {
                containers = containers.concat(node);
            } else if (node instanceof NodeList) {
                containers = containers.concat(Array.from(node) as Element[]);
            } else {
                containers.push(node);
            }
        }
        return containers;
    }

    /*
     * Find math within the document:
     *  Get the list of containers (default is document.body), and for each:
     *    For each input jax:
     *      Make a new MathList to store the located math
     *      If the input jax processes strings:
     *        If we haven't already made the string array and corresponding node list, do so
     *        Ask the jax to find the math in the string array, and
     *          for each one, push it onto the math list
     *      Otherwise (the jax processes DOM nodes):
     *        Ask the jax to find the math in the container, and
     *          for each one, make the result into a MathItem, and push it on the list
     *      Merge the new math list into the document's math list
     *        (we use merge to maintain a sorted list of MathItems)
     *
     * @override
     */
    public FindMath(options: OptionList) {
        if (!this.processed.FindMath) {
            options = UserOptions({elements: [this.document.body]}, options);
            for (const container of this.getElements(options['elements'], this.document)) {
                let [strings, nodes] = [null, null] as [string[], HTMLNodeArray];
                for (const jax of this.InputJax) {
                    let list = new (this.options['MathList'])();
                    if (jax.processStrings) {
                        if (strings === null) {
                            [strings, nodes] = this.DomStrings.Find(container);
                        }
                        for (const math of jax.FindMath(strings)) {
                            list.push(this.MathItem(math, jax, nodes));
                        }
                    } else {
                        for (const math of jax.FindMath(container)) {
                            let item = new HTMLMathItem(math.math, jax, math.display, math.start, math.end);
                            list.push(item);
                        }
                    }
                    this.math.merge(list);
                }
            }
            this.processed.FindMath = true;
        }
        return this;
    }

    /*
     * @override
     */
    public UpdateDocument() {
        if (!this.processed.UpdateDocument) {
            super.UpdateDocument();
            let sheet = this.DocumentStyleSheet();
            if (sheet) {
                let styles = this.document.getElementById(sheet.id);
                if (styles) {
                    styles.parentNode.replaceChild(sheet, styles);
                } else {
                    this.document.head.appendChild(sheet);
                }
            }
            this.processed.UpdateDocument = true;
        }
        return this;
    }

    /*
     * @override
     */
    public RemoveFromDocument(restore: boolean = false) {
        if (this.processed.UpdateDocument) {
            for (const math of this.math.toArray()) {
                if (math.State() >= STATE.INSERTED) {
                    math.State(STATE.TYPESET, restore);
                }
            }
        }
        this.processed.UpdateDocument = false;
        return this;
    }

    /*
     * @override
     */
    public DocumentStyleSheet() {
        return this.OutputJax.StyleSheet(this);
    }

    /*
     * @override
     */
    public TestMath(text: string, display: boolean = true) {
        if (!this.processed['TestMath']) {
            let math = new HTMLMathItem(text, this.InputJax[0], display);
            math.setMetrics(6, 14, 1000000, 1000000, 1);
            this.math.push(math);
            this.processed['TestMath'] = true;
        }
        return this;
    }

}

let STATE = HTMLDocument.STATE;
