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
 * @fileoverview  The DOMAdaptor interface and abstract class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../util/Options.js';

/*
 * A style declaration
 */
export type StyleData = {
    [property: string]: string | number;
};

/*
 * The data for an attribute
 */
export type AttributeData = {
    name: string,
    value: string
};


/*****************************************************************/
/*
 *  The interface for the DOMAdaptor
 *
 *  N = HTMLElement node class
 *  T = Text node class
 *  D = Document class
 */

export interface DOMAdaptor<N, T, D> {
    /*
     * Document in which the nodes are to be created
     */
    document: D;

    /*
     * @param{string} type      The tag name of the HTML node to be created
     * @param{OptionList} def   The properties to set for the created node
     * @param{(N|T)[]} content  The child nodes for the created HTML node
     * @return{N}               The generated HTML tree
     */
    node(type: string, def: OptionList, children: (N | T)[]): N;

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
     * @param{N|T} node  The HTML node whose parent is to be obtained
     * @return{N}        The parent node of the given one
     */
    parentNode(node: N | T): N;

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
     * @param{N|T} node   The HTML node whose sibling is to be obtained
     * @return{N|T}       The node following the given one (or null)
     */
    nextSibling(node: N | T): N | T;

    /*
     * @param{N|T} node   The HTML node whose sibling is to be obtained
     * @return{N|T}       The node preceding the given one (or null)
     */
    previousSibling(node: N | T): N | T;

    /*
     * @param{N} node   The HTML node whose child is to be obtained
     * @return{N|T}     The first child of the given node (or null)
     */
    firstChild(node: N): N | T;

    /*
     * @param{N} node   The HTML node whose child is to be obtained
     * @return{N}       The last child of the given node (or null)
     */
    lastChild(node: N): N | T;

    /*
     * @param{N} node    The HTML node whose children are to be obtained
     * @return{(N|T)[]}  Array of children for the given node (not a live list)
     */
    childNodes(node: N): (N | T)[];

    /*
     * @param{N} node    The HTML node whose child is to be obtained
     * @param{number} i  The index of the child to return
     * @return{N|T}      The i-th child node of the given node (or null)
     */
    childNode(node: N, i: number): N | T;

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
    allAttributes(node: N): AttributeData[];

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
 *  Abstract DOMAdaptor class for creating HTML elements
 */

export abstract class AbstractDOMAdaptor<N, T, D> implements DOMAdaptor<N, T, D> {
    /*
     * The document in which the HTML nodes will be created
     */
    public document: D;

    /*
     * @param{D} document  The document in which the nodes will be created
     * @constructor
     */
    constructor(document: D = null) {
        this.document = document;
    }

    /*
     * @override
     */
    public node(type: string, def: OptionList = {}, children: (N | T)[] = []) {
        const node = this.create(type);
        this.setAttributes(node, def);
        for (const child of children) {
            this.appendChild(node, child);
        }
        return node as N;
    }

    /*
     * @param{string} type  The type of the node to create
     * @return{N}           The created node
     */
    protected create(type: string) {
        return null as N;
    }

    /*
     * @override
     */
    public text(text: string) {
        return null as T;
    }

    /*
     * @param{N} node           The HTML element whose attributes are to be set
     * @param{OptionList} def   The attributes to set on that node
     */
    public setAttributes(node: N, def: OptionList) {
        if (def.style) {
            for (let key of Object.keys(def.style)) {
                this.setStyle(node, key.replace(/-([a-z])/g, (m, c) => c.toUpperCase()), def.style[key]);
            }
        }
        if (def.properties) {
            for (let key of Object.keys(def.properties)) {
                (node as OptionList)[key] = def.properties[key];
            }
        }
        for (let key of Object.keys(def)) {
            if (key !== 'style' && key !== 'properties') {
                this.setAttribute(node, key, def[key]);
            }
        }
    }

    /*
     * @override
     */
    public ownerDocument(node: N) {
        return this.document;
    }

    /*
     * @override
     */
    public parentNode(node: N | T) {
        return null as N;
    }

    /*
     * @override
     */
    public appendChild(node: N, child: N | T) {
        return null as N | T;
    }

    /*
     * @override
     */
    public insertBefore(node: N, nchild: N | T, ochild: N | T) {
    }

    /*
     * @override
     */
    public removeChild(node: N, child: N | T) {
        return null as N | T;
    }

    /*
     * @override
     */
    public cloneNode(node: N) {
        return null as N;
    }

    /*
     * @override
     */
    public nextSibling(node: N | T) {
        return null as N | T;
    }

    /*
     * @override
     */
    public previousSibling(node: N | T) {
        return null as N | T;
    }

    /*
     * @override
     */
    public firstChild(node: N) {
        return null as N | T;
    }

    /*
     * @override
     */
    public lastChild(node: N) {
        return null as N | T;
    }

    /*
     * @override
     */
    public childNodes(node: N) {
        return Array() as (N | T)[];
    }

    /*
     * @override
     */
    public childNode(node: N, i: number) {
        return this.childNodes(node)[i];
    }

    /*
     * @override
     */
    public tagName(node: N) {
        return "unknown";
    }

    /*
     * @override
     */
    public nodeValue(node: N | T) {
        return "";
    }

    /*
     * @override
     */
    public innerHTML(node: N) {
        return this.childNodes(node).map(x => this.outerHTML(node)).join('');
    }

    /*
     * @override
     */
    public outerHTML(node: N) {
        const tag = this.tagName(node);
        const attributes = this.allAttributes(node).map(
            (x: AttributeData) => x.name + '="' + this.protectHTML(x.value) + '"'
        ).join(' ');
        const html: string =
            '<' + tag + (attributes ? ' ' + attributes : '') + '>'
            + this.innerHTML(node)
            + '</' + tag + '>';
        return html;
    }

    /*
     * @param{string} text  The text to be HTML escaped
     * @return{string}      The string with &, <, >, and " replaced by entities
     */
    protected protectHTML(text: string) {
        return text.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/, '&quot;');
    }

    /*
     * @override
     */
    public setAttribute(node: N, name: string, value: string) {
    }

    /*
     * @override
     */
    public getAttribute(node: N, name: string) {
        return "";
    }

    /*
     * @override
     */
    public removeAttribute(node: N, name: string) {
    }

    /*
     * @override
     */
    public hasAttribute(node: N, name: string) {
        return false;
    }

    /*
     * @override
     */
    public allAttributes(node: N) {
        return [] as AttributeData[];
    }

    /*
     * @override
     */
    public addClass(node: N, name: string) {
    }

    /*
     * @override
     */
    public removeClass(node: N, name: string) {
    }

    /*
     * @override
     */
    public setStyle(node: N, name: string, value: string) {
    }

    /*
     * @override
     */
    public getStyle(node: N, name: string) {
        return "";
    }

    /*
     * @override
     */
    public allStyles(node: N) {
        return {} as any;
    }

}
