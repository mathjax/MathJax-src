/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview  Implements the HTML DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../util/Options.js';
import {AttributeData, AbstractDOMAdaptor, DOMAdaptor} from '../core/DOMAdaptor.js';

/*****************************************************************/
/*
 * The minimum fields needed for a Document
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 */
export interface MinDocument<N, T> {
    documentElement: N;
    head: N;
    body: N;
    createElement(type: string): N;
    createTextNode(text: string): T;
    querySelectorAll(selector: string): N[];
}

/*****************************************************************/
/*
 * The minimum fields needed for an HTML Element
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 */
export interface MinHTMLElement<N, T> {
    nodeName: string;
    nodeValue: string;
    textContent: string;
    innerHTML: string;
    outerHTML: string;
    parentNode: N | Node;
    nextSibling: N | T | Node;
    previousSibling: N | T | Node;

    attributes: AttributeData[] | NamedNodeMap;
    classList: DOMTokenList;
    style: OptionList;

    childNodes: (N | T)[] | NodeList;
    firstChild: N | T | Node;
    lastChild: N | T | Node;
    getElementsByTagName(name: string): N[] | HTMLCollectionOf<Element>;
    getElementsByTagNameNS(ns: string, name: string): N[] | HTMLCollectionOf<Element>;
    appendChild(child: N | T): N | T | Node;
    removeChild(child: N | T): N | T  | Node;
    replaceChild(nnode: N | T, onode: N | T): N | T  | Node;
    insertBefore(nchild: N | T, ochild: N | T): void;
    cloneNode(deep: boolean): N | Node;
    setAttribute(name: string, value: string): void;
    getAttribute(name: string): string;
    removeAttribute(name: string): void;
    hasAttribute(name: string): boolean;
}

/*****************************************************************/
/*
 * The minimum fields needed for a Text element
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 */
export interface MinText<N, T> {
    nodeName: string;
    nodeValue: string;
    parentNode: N | Node;
    nextSibling: N | T | Node;
    previousSibling: N | T | Node;
    splitText(n: number): T;
}

/*****************************************************************/
/*
 * The minimum fields needed for a DOMParser
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 */
export interface MinDOMParser<D> {
    parseFromString(text: string, format?: string): D;
}

/*****************************************************************/
/*
 * The minimum fields needed for a Window
 */

/*
 * @template D  The Document class
 */
export interface MinWindow<D> {
    document: D;
    DOMParser: {
        new(): MinDOMParser<D>
    };
    NodeList: any;
    HTMLCollection: any;
    HTMLElement: any;
    DocumentFragment: any;
    Document: any;
}

/*****************************************************************/
/*
 * The minimum needed for an HTML Adaptor
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface MinHTMLAdaptor<N, T, D> extends DOMAdaptor<N, T, D> {
    window: MinWindow<D>
}

/*****************************************************************/
/*
 *  Abstract HTMLAdaptor class for manipulating HTML elements
 *  (subclass of AbstractDOMAdaptor)
 *
 *  N = HTMLElement node class
 *  T = Text node class
 *  D = Document class
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class HTMLAdaptor<N extends MinHTMLElement<N, T>,
                         T extends MinText<N, T>,
                         D extends MinDocument<N, T>>
extends AbstractDOMAdaptor<N, T, D> implements MinHTMLAdaptor<N, T, D> {
    /*
     * The window object for this adaptor
     */
    window: MinWindow<D>;

    /*
     * The DOMParser used to parse a string into a DOM tree
     */
    parser: MinDOMParser<D>;

    /*
     * @override
     * @constructor
     */
    constructor(window: MinWindow<D>) {
        super(window.document);
        this.window = window;
        this.parser = new (window.DOMParser as any)();
    }

    /*
     * @override
     */
    public parse(text: string, format: string = 'text/html') {
        return this.parser.parseFromString(text, format);
    }

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
    public head(doc: D) {
        return doc.head;
    }

    /*
     * @override
     */
    public body(doc: D) {
        return doc.body;
    }

    /*
     * @override
     */
    public root(doc: D) {
        return doc.documentElement;
    }

    /*
     * @override
     */
    public tags(node: N, name: string, ns: string = null) {
        let nodes = (ns ? node.getElementsByTagNameNS(ns, name) : node.getElementsByTagName(name));
        return Array.from(nodes as N[]) as N[];
    }

    /*
     * @override
     */
    public getElements(nodes: (string | N | N[])[], document: D) {
        let containers: N[] = [];
        for (const node of nodes) {
            if (typeof(node) === 'string') {
                containers = containers.concat(Array.from(this.document.querySelectorAll(node)));
            } else if (Array.isArray(node)) {
                containers = containers.concat(Array.from(node) as N[]);
            } else if (node instanceof this.window.NodeList || node instanceof this.window.HTMLCollection) {
                containers = containers.concat(Array.from(node as any as N[]));
            } else {
                containers.push(node);
            }
        }
        return containers;
    }

    /*
     * @override
     */
    public parent(node: N | T) {
        return node.parentNode as N;
    }

    /*
     * @override
     */
    public append(node: N, child: N | T) {
        return node.appendChild(child) as N | T;
    }

    /*
     * @override
     */
    public insert(nchild: N | T, ochild: N | T) {
        return this.parent(ochild).insertBefore(nchild, ochild);
    }

    /*
     * @override
     */
    public remove(child: N | T) {
        return this.parent(child).removeChild(child) as N | T;
    }

    /*
     * @override
     */
    public replace(nnode: N | T, onode: N | T) {
        return this.parent(onode).replaceChild(nnode, onode) as N | T;
    }

    /*
     * @override
     */
    public clone(node: N) {
        return node.cloneNode(true) as N;
    }

    /*
     * @override
     */
    public split(node: T, n: number) {
        return node.splitText(n);
    }

    /*
     * @override
     */
    public next(node: N | T) {
        return node.nextSibling as N | T;
    }

    /*
     * @override
     */
    public previous(node: N | T) {
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
        return Array.from(node.childNodes as (N | T)[]);
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
    public kind(node: N | T) {
        return node.nodeName.toLowerCase();
    }

    /*
     * @override
     */
    public value(node: N | T) {
        return node.nodeValue || '';
    }

    /*
     * @override
     */
    public textContent(node: N) {
        return node.textContent;
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
        name = name.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
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
            (x: AttributeData) => {
                return {name: x.name, value: x.value} as AttributeData;
            }
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
    public hasClass(node: N, name: string) {
        return node.classList.contains(name);
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
        return node.style.cssText;
    }

}
