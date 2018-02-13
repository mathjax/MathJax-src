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
 * @fileoverview  Support functions for creating DOM elements
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from './Options.js';

export interface NodeHandler<N, T, D> {

    /*
     * @param{string} type     The tag name of the HTML node to be created
     * @param{OptionList} def  The properties to set for the created node
     * @param{N[]} content     The child nodes for the created HTML node
     * @return{N}              The generated HTML tree
     */
    node(type: string, def: OptionList, children: N[]): N;

    /*
     * @param{string} text   The text from which to create an HTML text node
     * @return{T}            The generated text node with the given text
     */
    text(text: string): T;

    /*
     * @param{N} node   The HTML node whose document is to be obtained
     * @return{D}       The document where the node was created
     */
    ownerDocument(node: N): D;

    /*
     * @param{N} node   The HTML node whose parent is to be obtained
     * @return{N}       The parent node of the given one
     */
    parentNode(node: N): N;

    /*
     * @param{N} node     The HTML node to be appended to
     * @param{N|T} child  The node or text to be appended
     * @return{N|T}       The appended node
     */
    appendChild(node: N, child: N | T): N | T;

    /*
     * @param{N} node      The HTML node to be appended to
     * @param{N|T} nchild  The node or text to be inserted
     * @param{N|T} ochild  The node or text where the new child is to be added before it (or null if appended)
     */
    insertBefore(node: N, nchild: N | T, ochild: N | T): void;

    /*
     * @param{N} node     The HTML node whose child is to be removed
     * @param{N|T} child  The node or text to be removed
     * @return{N|T}       The removed node
     */
    removeChild(node: N, child: N | T): N | T;

    /*
     * @param{N} node   The HTML node to be cloned
     * @return{N}       The copied node
     */
    cloneNode(node: N): N;

    /*
     * @param{N} node   The HTML node whose sibling is to be obtained
     * @return{N}       The node following the given one (or null)
     */
    nextSibling(node: N): N;

    /*
     * @param{N} node   The HTML node whose sibling is to be obtained
     * @return{N}       The node preceding the given one (or null)
     */
    previousSibling(node: N): N;

    /*
     * @param{N} node   The HTML node whose child is to be obtained
     * @return{N}       The first child of the given node (or null)
     */
    firstChild(node: N): N;

    /*
     * @param{N} node   The HTML node whose child is to be obtained
     * @return{N}       The last child of the given node (or null)
     */
    lastChild(node: N): N;

    /*
     * @param{N} node   The HTML node whose children are to be obtained
     * @return{N[]}     Array of children for the given node (not a live list)
     */
    childNodes(node: N): N[];

    /*
     * @param{N} node    The HTML node whose child is to be obtained
     * @param{number} i  The index of the child to return
     * @return{N}        The i-th child node of the given node (or null)
     */
    childNode(node: N, i: number): N;

    /*
     * @param{N} node   The HTML node whose tag name is to be obtained
     * @return{string}  The tag name of the given node
     */
    tagName(node: N): string;

    /*
     * @param{N|T} node  The HTML node whose value is to be obtained
     * @return{string}   The value of the given node
     */
    nodeValue(node: N | T): string;

    /*
     * @param{N} node   The HTML node whose inner HTML string is to be obtained
     * @return{string}  The serialized content of the node
     */
    innerHTML(node: N): string;

    /*
     * @param{N} node   The HTML node whose outer HTML string is to be obtained
     * @return{string}  The serialized node and its content
     */
    outerHTML(node: N): string;

    /*
     * @param{N} node        The HTML node whose attribute is to be set
     * @param{string} name   The name of the attribute to set
     * @param{string} value  The new value of the attribute
     */
    setAttribute(node: N, name: string, value: string): void;

    /*
     * @param{N} node        The HTML node whose attribute is to be obtained
     * @param{string} name   The name of the attribute to get
     * @return{string}       The value of the given attribute of the given node
     */
    getAttribute(node: N, name: string): string;

    /*
     * @param{N} node        The HTML node whose attribute is to be removed
     * @param{string} name   The name of the attribute to remove
     */
    removeAttribute(node: N, name: string): void;

    /*
     * @param{N} node        The HTML node whose attribute is to be tested
     * @param{string} name   The name of the attribute to test
     * @return{boolean}      True of the node has the given attribute defined
     */
    hasAttribute(node: N, name: string): boolean;

    /*
     * @param{N} node        The HTML node whose attributes are to be returned
     * @return{any}          The list of attributes (FIXME: work out the format)
     */
    allAttributes(node: N): any;

    /*
     * @param{N} node        The HTML node whose class is to be augmented
     * @param{string} name   The class to be added
     */
    addClass(node: N, name: string): void;

    /*
     * @param{N} node        The HTML node whose class is to be changed
     * @param{string} name   The class to be removed
     */
    removeClass(node: N, name: string): void;

    /*
     * @param{N} node        The HTML node whose style is to be changed
     * @param{string} name   The style to be set
     * @param{string} name   The new value of the style
     */
    setStyle(node: N, name: string, value: string): void;

    /*
     * @param{N} node        The HTML node whose style is to be obtained
     * @param{string} name   The style to be obtained
     * @return{string}       The value of the style
     */
    getStyle(node: N, name: string): string;

    /*
     * @param{N} node        The HTML node whose styles are to be returned
     * @return{OptionList}   The list of style values (FIXME: work out the format)
     */
    allStyles(node: N): OptionList;
}

/*****************************************************************/
/*
 *  Implements the HTMLNodes class for creating HTML elements
 */

export class HTMLNodes implements NodeHandler<HTMLElement, Text, Document> {
    /*
     * The document in which the HTML nodes will be created
     */
    public document: Document;

    /*
     * @param{Document} document  The document in which the nodes will be created
     * @constructor
     */
    constructor(document: Document = null) {
        this.document = document;
    }

    /*
     * @override
     */
    public node(type: string, def: OptionList = {}, children: Node[] = []) {
        let node = this.document.createElement(type);
        this.setAttributes(node, def);
        for (const child of children) {
            node.appendChild(child);
        }
        return node as HTMLElement;
    }

    /*
     * @override
     */
    public text(text: string) {
        return this.document.createTextNode(text);
    }

    /*
     * @param{HTMLElement} node  The HTML element whose properties are to be set
     * @param{OptionList} def    The properties to set on that node
     */
    public setAttributes(node: HTMLElement, def: OptionList) {
        if (def.style) {
            let style = node.style as OptionList;
            for (let key of Object.keys(def.style)) {
                style[key.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = def.style[key];
            }
        }
        if (def.properties) {
            for (let key of Object.keys(def.properties)) {
                (node as OptionList)[key] = def.properties[key];
            }
        }
        for (let key of Object.keys(def)) {
            if (key !== 'style' && key !== 'properties') {
                node.setAttribute(key, def[key]);
            }
        }
    }

    /*
     * @override
     */
    public ownerDocument(node: HTMLElement) {
        return node.ownerDocument;
    }

    /*
     * @override
     */
    public parentNode(node: HTMLElement){
        return node.parentNode as HTMLElement;
    }

    /*
     * @override
     */
    public appendChild(node: HTMLElement, child: HTMLElement | Text) {
        return node.appendChild(child) as HTMLElement;
    }

    /*
     * @override
     */
    public insertBefore(node: HTMLElement, nchild: HTMLElement | Text, ochild: HTMLElement | Text) {
        return node.insertBefore(nchild, ochild);
    }

    /*
     * @override
     */
    public removeChild(node: HTMLElement, child: HTMLElement | Text) {
        return node.removeChild(child) as HTMLElement;
    }

    /*
     * @override
     */
    public cloneNode(node: HTMLElement) {
        return node.cloneNode(true) as HTMLElement;
    }

    /*
     * @override
     */
    public nextSibling(node: HTMLElement) {
        return node.nextSibling as HTMLElement;
    }

    /*
     * @override
     */
    public previousSibling(node: HTMLElement) {
        return node.previousSibling as HTMLElement;
    }

    /*
     * @override
     */
    public firstChild(node: HTMLElement) {
        return node.firstChild as HTMLElement;
    }

    /*
     * @override
     */
    public lastChild(node: HTMLElement) {
        return node.lastChild as HTMLElement;
    }

    /*
     * @override
     */
    public childNodes(node: HTMLElement) {
        return Array.from(node.childNodes) as HTMLElement[];
    }

    /*
     * @override
     */
    public childNode(node: HTMLElement, i: number) {
        return node.childNodes[i] as HTMLElement;
    }

    /*
     * @override
     */
    public tagName(node: HTMLElement) {
        return node.tagName;
    }

    /*
     * @override
     */
    public nodeValue(node: HTMLElement | Text) {
        return node.nodeValue;
    }

    /*
     * @override
     */
    public innerHTML(node: HTMLElement) {
        return node.innerHTML;
    }

    /*
     * @override
     */
    public outerHTML(node: HTMLElement) {
        return node.outerHTML;
    }

    /*
     * @override
     */
    public setAttribute(node: HTMLElement, name: string, value: string) {
        return node.setAttribute(name, value);
    }

    /*
     * @override
     */
    public getAttribute(node: HTMLElement, name: string) {
        return node.getAttribute(name);
    }

    /*
     * @override
     */
    public removeAttribute(node: HTMLElement, name: string) {
        return node.removeAttribute(name);
    }

    /*
     * @override
     */
    public hasAttribute(node: HTMLElement, name: string) {
        return node.hasAttribute(name);
    }

    /*
     * @override
     */
    public allAttributes(node: HTMLElement) {
        return node.attributes;
    }

    /*
     * @override
     */
    public addClass(node: HTMLElement, name: string) {
        node.classList.add(name);
    }

    /*
     * @override
     */
    public removeClass(node: HTMLElement, name: string) {
        return node.classList.remove(name);
    }

    /*
     * @override
     */
    public setStyle(node: HTMLElement, name: string, value: string) {
        (node.style as OptionList)[name] = value;
    }

    /*
     * @override
     */
    public getStyle(node: HTMLElement, name: string) {
        return (node.style as OptionList)[name];
    }

    /*
     * @override
     */
    public allStyles(node: HTMLElement) {
        return node.style;
    }

}
