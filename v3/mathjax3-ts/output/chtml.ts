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
 * @fileoverview  Implements the CHTML OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractOutputJax} from '../core/OutputJax.js';
import {LegacyCHTML} from '../../mathjax2/output/CommonHTML.js';
import {OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';

/*****************************************************************/
/*
 *  Implements the CHTML class (extends AbstractOutputJax)
 */

export class CHTML extends AbstractOutputJax {

    public static NAME: string = 'CHTML';
    public static OPTIONS: OptionList = {
        ...AbstractOutputJax.OPTIONS
    };

    /*
     * @override
     */
    public Typeset(math: MathItem, html: MathDocument) {
        return LegacyCHTML.Typeset(math, html);
    }

    /*
     * Handle an escaped character
     *  (put it in a span so that it won't be a delimiter if
     *  the page is typeset again).
     *
     * @override
     */
    public Escaped(math: MathItem, html: MathDocument) {
        let span = html.document.createElement('span');
        span.appendChild(html.document.createTextNode(math.math));
        return span;
    }

    /*
     * @override
     */
    public GetMetrics(html: MathDocument) {
        return LegacyCHTML.GetMetrics(html);
    }

    /*
     * @override
     */
    public StyleSheet(html: MathDocument) {
        return LegacyCHTML.StyleSheet(html);
    }

}
