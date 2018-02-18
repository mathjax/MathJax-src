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
 * @fileoverview  Implements the HTMLNodes DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../util/Options.js';
import {AttributeData, AbstractDOMAdaptor} from '../core/DOMAdaptor.js';



/*****************************************************************/
/*
 * The minimum fields needed for an HTML Element
 */
export interface MinDocument<N, T> {
    createElement(type: string): N;
    createTextNode(text: string): T;
};

export interface MinHTMLElement<N, T> {
    tagName: string;
    nodeValue: string;
    innerHTML: string;
    outerHTML: string;
    parentNode: N | Node;
    nextSibling: N | T | Node;
    previousSibling: N | T | Node;
    childNodes: (N | T)[] | NodeList;
    firstChild: N | T | Node;
    lastChild: N | T | Node;
    appendChild(child: N | T): N | T | Node;
    removeChild(child: N | T): N | T  | Node;
    insertBefore(nchild: N | T, ochild: N | T): void;
    cloneNode(deep: boolean): N | Node;
    setAttribute(name: string, value: string): void;
    getAttribute(name: string): string;
    removeAttribute(name: string): void;
    hasAttribute(name: string): boolean;
    attributes: AttributeData[] | NamedNodeMap;
    classList: DOMTokenList;
    style: OptionList;
};

export interface MinText<N, T> {
    nodeValue: string;
    parentNode: N | Node;
    nextSibling: N | T | Node;
    previousSibling: N | T | Node;
};



/*****************************************************************/
/*
 *  Implements the HTMLNodes class for manipulating HTML elements
 *  (subclass of AbstractDOMAdaptor)
 *
 *  N = HTMLElement node class
 *  T = Text node class
 *  D = Document class
 */

export class HTMLAdaptor<N extends MinHTMLElement<N, T>,
                         T extends MinText<N, T>,
                         D extends MinDocument<N, T>> extends AbstractDOMAdaptor<N, T, D> {

    /*
     * @override
     */
    protected create(type: string) {
        return this.document.createElement(type);
    }

    /*
     * @override
     */
    public text(text: string) {
        return this.document.createTextNode(text);
    }

    /*
     * @override
     */
    public parentNode(node: N | T) {
        return node.parentNode as N;
    }

    /*
     * @override
     */
    public appendChild(node: N, child: N | T) {
        return node.appendChild(child) as N | T;
    }

    /*
     * @override
     */
    public insertBefore(node: N, nchild: N | T, ochild: N | T) {
        return node.insertBefore(nchild, ochild);
    }

    /*
     * @override
     */
    public removeChild(node: N, child: N | T) {
        return node.removeChild(child) as N | T;
    }

    /*
     * @override
     */
    public cloneNode(node: N) {
        return node.cloneNode(true) as N;
    }

    /*
     * @override
     */
    public nextSibling(node: N | T) {
        return node.nextSibling as N | T;
    }

    /*
     * @override
     */
    public previousSibling(node: N | T) {
        return node.previousSibling as N | T;
    }

    /*
     * @override
     */
    public firstChild(node: N) {
        return node.firstChild as N | T;
    }

    /*
     * @override
     */
    public lastChild(node: N) {
        return node.lastChild as N | T;
    }

    /*
     * @override
     */
    public childNodes(node: N) {
        return node.childNodes as (N | T)[];
    }

    /*
     * @override
     */
    public childNode(node: N, i: number) {
        return node.childNodes[i] as N | T;
    }

    /*
     * @override
     */
    public tagName(node: N) {
        return node.tagName;
    }

    /*
     * @override
     */
    public nodeValue(node: N | T) {
        return node.nodeValue;
    }

    /*
     * @override
     */
    public innerHTML(node: N) {
        return node.innerHTML;
    }

    /*
     * @override
     */
    public outerHTML(node: N) {
        return node.outerHTML;
    }

    /*
     * @override
     */
    public setAttribute(node: N, name: string, value: string) {
        return node.setAttribute(name, value);
    }

    /*
     * @override
     */
    public getAttribute(node: N, name: string) {
        return node.getAttribute(name);
    }

    /*
     * @override
     */
    public removeAttribute(node: N, name: string) {
        return node.removeAttribute(name);
    }

    /*
     * @override
     */
    public hasAttribute(node: N, name: string) {
        return node.hasAttribute(name);
    }

    /*
     * @override
     */
    public allAttributes(node: N) {
        return Array.from(node.attributes).map(
            (x: AttributeData) => {return {name: x.name, value: x.value} as AttributeData}
        );
    }

    /*
     * @override
     */
    public addClass(node: N, name: string) {
        node.classList.add(name);
    }

    /*
     * @override
     */
    public removeClass(node: N, name: string) {
        return node.classList.remove(name);
    }

    /*
     * @override
     */
    public setStyle(node: N, name: string, value: string) {
        (node.style as OptionList)[name] = value;
    }

    /*
     * @override
     */
    public getStyle(node: N, name: string) {
        return (node.style as OptionList)[name];
    }

    /*
     * @override
     */
    public allStyles(node: N) {
        return node.style;
    }

}
