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
 *  Implements the HTMLNodes class for manipulating HTML elements
 *  (subclass of AbstractDOMAdaptor)
 */

export class HTMLAdaptor extends AbstractDOMAdaptor<HTMLElement, Text, Document> {

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
    public parentNode(node: HTMLElement | Text) {
        return node.parentNode as HTMLElement;
    }

    /*
     * @override
     */
    public appendChild(node: HTMLElement, child: HTMLElement | Text) {
        return node.appendChild(child) as HTMLElement | Text;
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
    public nextSibling(node: HTMLElement | Text) {
        return node.nextSibling as HTMLElement | Text;
    }

    /*
     * @override
     */
    public previousSibling(node: HTMLElement | Text) {
        return node.previousSibling as HTMLElement | Text;
    }

    /*
     * @override
     */
    public firstChild(node: HTMLElement) {
        return node.firstChild as HTMLElement | Text;
    }

    /*
     * @override
     */
    public lastChild(node: HTMLElement) {
        return node.lastChild as HTMLElement | Text;
    }

    /*
     * @override
     */
    public childNodes(node: HTMLElement) {
        return Array.from(node.childNodes) as (HTMLElement | Text)[];
    }

    /*
     * @override
     */
    public childNode(node: HTMLElement, i: number) {
        return node.childNodes[i] as HTMLElement | Text;
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
        return Array.from(node.attributes).map(
            (x: AttributeData) => {return {name: x.name, value: x.value} as AttributeData}
        );
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
