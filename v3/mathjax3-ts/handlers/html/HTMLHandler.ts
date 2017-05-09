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
 * @fileoverview  Implements the HTMLHandler object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractHandler} from '../../core/Handler.js';
import {HTMLDocument} from './HTMLDocument.js';
import {OptionList} from '../../util/Options.js';
import {DOM} from '../../util/DOM.js';

/*****************************************************************/
/*
 *  Typescript's Window doesn't seem to include these constructors,
 *  so use this fake interface to access them.
 */

interface DOMWindow extends Window {
    DOMParser?: typeof DOMParser;
    HTMLElement?: typeof HTMLElement;
    DocumentFragment?: typeof DocumentFragment;
}


/*****************************************************************/
/*
 *  Implements the HTMLHandler class (extends AbstractHandler)
 */

export class HTMLHandler extends AbstractHandler {

    /*
     * A DOMParser instance used to create new documents if they are specified
     * by a zerialized HTML document rather than an already parsed one.
     */
    protected parser: DOMParser;

    /*
     * Some classes that can be used as the document for HTMLHandler.
     */
    protected DOCUMENT: typeof Document;
    protected HTMLELEMENT: typeof HTMLElement;
    protected FRAGMENT: typeof DocumentFragment;

    /*
     * @override
     * @constructor
     * @extends{AbstractHandler)
     */
    constructor(priority: number = 5) {
        super(priority);
        let window = DOM.window as DOMWindow;
        this.DOCUMENT = DOM.document.constructor as typeof Document;
        this.HTMLELEMENT = window.HTMLElement;
        this.FRAGMENT = window.DocumentFragment;
        this.parser = new (DOM.DOMParser)();
    }

    /*
     * @override
     */
    public handlesDocument(document: any) {
        if (typeof(document) === 'string') {
            try {
                document = this.parser.parseFromString(document, 'text/html');
            } catch (err) {}
        }
        if (document instanceof this.DOCUMENT ||
            document instanceof this.HTMLELEMENT ||
            document instanceof this.FRAGMENT) {
            return true;
        }
        return false;
    }

    /*
     * If the document isn't already a Document object, create one
     * using the given data
     *
     * @override
     */
    public create(document: any, options: OptionList) {
        if (typeof(document) === 'string') {
            document = this.parser.parseFromString(document, 'text/html');
        } else if (document instanceof this.HTMLELEMENT) {
            let child = document;
            document = this.parser.parseFromString('', 'text/html');
            document.body.appendChild(child);
        } else if (document instanceof this.FRAGMENT) {
            let fragment = document;
            document = this.parser.parseFromString('', 'text/html');
            document.body.appendChild(fragment);
        }
        return new HTMLDocument(document, options);
    }

}
