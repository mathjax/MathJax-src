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
 * @fileoverview  Implements the HTMLMathItem class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractMathItem, Location} from '../../core/MathItem.js';
import {InputJax} from '../../core/InputJax.js';
import {DOMAdaptor} from '../../core/DOMAdaptor.js';
import {HTMLDocument} from './HTMLDocument.js';

/*****************************************************************/
/*
 *  Implements the HTMLMathItem class (extends AbstractMathItem)
 */

export class HTMLMathItem<N, T, D> extends AbstractMathItem<N, T, D> {

    public static STATE = AbstractMathItem.STATE;

    /*
     * Easy access to DOM adaptor
     */
    get adaptor() {
        return this.inputJax.adaptor;
    }

    /*
     * @override
     */
    constructor(math: string, jax: InputJax<N, T, D>, display: boolean = true,
                start: Location<N, T> = {node: null, n: 0, delim: ''},
                end: Location<N, T> = {node: null, n: 0, delim: ''}) {
        super(math, jax, display, start, end);
    }

    /*
     * Not yet implemented
     *
     * @override
     */
    public addEventHandlers() {}

    /*
     * Insert the typeset MathItem into the document at the right location
     *   If the starting and ending nodes are the same:
     *     Split the text to isolate the math and its delimiters
     *     Replace the math by the typeset version
     *   Otherewise (spread over several nodes)
     *     Split the start node, if needed
     *     Remove nodes until we reach the end node
     *     Insert the math before the end node
     *     Split the end node, if needed
     *     Remove the end node
     *
     * @override
     */
    public updateDocument(html: HTMLDocument<N, T, D>) {
        if (this.state() < STATE.INSERTED) {
            if (this.inputJax.processStrings) {
                let node = this.start.node as T;
                if (node === this.end.node) {
                    if (this.end.n < this.adaptor.nodeValue(this.end.node).length) {
                        this.adaptor.splitText(this.end.node, this.end.n);
                    }
                    if (this.start.n) {
                        node = this.adaptor.splitText(this.start.node as T, this.start.n);
                    }
                    this.adaptor.replaceChild(this.adaptor.parentNode(node), this.typesetRoot, node);
                } else {
                    if (this.start.n) {
                        node = this.adaptor.splitText(node, this.start.n);
                    }
                    while (node !== this.end.node) {
                        let next = this.adaptor.nextSibling(node) as T;
                        this.adaptor.removeChild(this.adaptor.parentNode(node), node);
                        node = next;
                    }
                    this.adaptor.insertBefore(this.adaptor.parentNode(node), this.typesetRoot, node);
                    if (this.end.n < this.adaptor.nodeValue(node).length) {
                        this.adaptor.splitText(node, this.end.n);
                    }
                    this.adaptor.removeChild(this.adaptor.parentNode(node), node);
                }
            } else {
                this.adaptor.replaceChild(this.adaptor.parentNode(this.start.node), this.typesetRoot, this.start.node);
            }
            this.start.node = this.end.node = this.typesetRoot;
            this.start.n = this.end.n = 0;
            this.state(STATE.INSERTED);
        }
    }

    /*
     * Remove the typeset math from the document, and put back the original
     *  expression and its delimiters, if requested.
     *
     * @override
     */
    public removeFromDocument(restore: boolean = false) {
        if (this.state() >= STATE.TYPESET) {
            let node = this.start.node;
            if (restore) {
                let text = this.start.delim + this.math + this.end.delim;
                let math;
                if (this.inputJax.processStrings) {
                    math = this.adaptor.text(text);
                } else {
                    const doc = this.adaptor.parseFromString(text, 'text/html');
                    math = this.adaptor.firstChild(this.adaptor.documentBody(doc));
                }
                this.adaptor.insertBefore(this.adaptor.parentNode(node), math, node);
            }
            this.adaptor.removeChild(this.adaptor.parentNode(node), node);
        }
    }

}

let STATE = HTMLMathItem.STATE;
