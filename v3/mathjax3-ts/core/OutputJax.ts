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
 * @fileoverview  Implements the interface and abstract class for the OutputJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {userOptions, defaultOptions, OptionList} from '../util/Options.js';
import {MathDocument} from './MathDocument.js';
import {MathItem, Metrics} from './MathItem.js';

/*****************************************************************/
/*
 *  The OutputJax interface
 */

export interface OutputJax {
    /*
     * The name of this output jax class
     */
    name: string;
    /*
     * The options for the instance
     */
    options: OptionList;

    /*
     * Typset a given MathItem
     *
     * @param{MathItem} math          The MathItem to be typeset
     * @param{MathDocument} document  The MathDocument in which the typesetting should occur
     * @return{Element}               The DOM tree for the typeset math
     */
    typeset(math: MathItem, document?: MathDocument): Element;

    /*
     * Handle an escaped character (e.g., \$ from the TeX input jax preventing it from being a delimiter)
     *
     * @param{MathItem} math          The MathItem to be escaped
     * @param{MathDocument} document  The MathDocument in which the math occurs
     * @return{Element}               The DOM tree for the escaped item
     */
    escaped(math: MathItem, document?: MathDocument): Element;

    /*
     * Get the metric information for all math in the given document
     *
     * @param{MathDocument} document  The MathDocument being processed
     */
    getMetrics(document: MathDocument): void;

    /*
     * Produce the stylesheet needed for this output jax
     *
     * @param{MathDocument} document  The MathDocument being processed
     */
    styleSheet(document: MathDocument): Element;
}


/*****************************************************************/
/*
 *  The OutputJax abstract class
 */

export abstract class AbstractOutputJax implements OutputJax {

    public static NAME: string = 'generic';
    public static OPTIONS: OptionList = {};

    public options: OptionList;

    /*
     * @param{OptionList} options  The options for this instance
     */
    constructor(options: OptionList = {}) {
        let CLASS = this.constructor as typeof AbstractOutputJax;
        this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
    }

    /*
     * @return{string}  The name for this output jax class
     */
    public get name() {
        return (this.constructor as typeof AbstractOutputJax).NAME;
    }

    /*
     * @override
     */
    public typeset(math: MathItem, document: MathDocument = null) {
        return null as Element;
    }

    /*
     * @override
     */
    public escaped(math: MathItem, document: MathDocument = null) {
        return null as Element;
    }

    /*
     * @override
     */
    public getMetrics(document: MathDocument) {
    }

    /*
     * @override
     */
    public styleSheet(document: MathDocument) {
        return null as Element;
    }

}
