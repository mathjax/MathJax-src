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
 * @fileoverview  Implements the HTMLHandler class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractHandler} from '../../core/Handler.js';
import {DOMAdaptor} from '../../core/DOMAdaptor.js';
import {HTMLDocument} from './HTMLDocument.js';
import {OptionList} from '../../util/Options.js';
import {DOM} from '../../util/DOM.js';

/*****************************************************************/
/*
 *  Implements the HTMLHandler class (extends AbstractHandler)
 */

export class HTMLHandler<N, T, D> extends AbstractHandler<N, T, D> {

    /*
     * A DOMParser instance used to create new documents if they are specified
     * by a serialized HTML document rather than an already parsed one.
     */
    protected parser: DOMParser;

    /*
     * @override
     * @constructor
     * @extends{AbstractHandler)
     */
    constructor(priority: number = 5) {
        super(priority);
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
        if (document instanceof DOM.window.Document ||
            document instanceof DOM.window.HTMLElement ||
            document instanceof DOM.window.DocumentFragment) {
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
    public create(document: any, adaptor: DOMAdaptor<N, T, D>, options: OptionList) {
        if (typeof(document) === 'string') {
            document = this.parser.parseFromString(document, 'text/html');
        } else if (document instanceof DOM.window.HTMLElement ||
                   document instanceof DOM.window.DocumentFragment) {
            let child = document;
            document = this.parser.parseFromString('', 'text/html');
            document.body.appendChild(child);
        }
        return new HTMLDocument<N, T, D>(document, adaptor, options);
    }

}
