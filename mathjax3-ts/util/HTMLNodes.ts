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

/*****************************************************************/
/*
 *  Implements the HTMLNodes class for creating HTML elements
 */

export class HTMLNodes {
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
     * @param{string} type     The tag name of the HTML node to be created
     * @param{OptionList} def  The properties to set for the created node
     * @param{Node[]} content  The child nodes for the created HTML node
     * @return{HTMLElement}    The generated HTML tree
     */
    public node(type: string, def: OptionList = {}, children: Node[] = []) {
        let node = this.document.createElement(type);
        this.setProperties(node, def);
        for (const child of children) {
            node.appendChild(child);
        }
        return node as HTMLElement;
    }

    /*
     * @param{string} text   The text from which to create an HTML text node
     * @return{HTMLElement}  The generated text node with the given text
     */
    public text(text: string) {
        return this.document.createTextNode(text);
    }

    /*
     * @param{HTMLElement} node  The HTML element whose properties are to be set
     * @param{OptionList} def    The properties to set on that node
     */
    public setProperties(node: HTMLElement, def: OptionList) {
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

}
