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
 * @fileoverview  Implements the interface and abstract class for the InputJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathItem, ProtoItem} from './MathItem.js';
import {MmlNode} from './MmlTree/MmlNode.js';
import {userOptions, defaultOptions, OptionList} from '../util/Options.js';
import {FunctionList} from '../util/FunctionList.js';

/*****************************************************************/
/*
 *  The InputJax interface
 */

export interface InputJax {
    /*
     * The name of the input jax subclass (e.g,. 'TeX')
     */
    name: string;

    /*
     * Whether this input jax processes string arrays or DOM nodes
     * (TeX and AsciiMath process strings, MathML processes DOM nodes)
     */
    processStrings: boolean;

    /*
     * The options for this input jax instance
     */
    options: OptionList;

    /*
     * Lists of pre- and post-filters to call before and after processing the input
     */
    preFilters: FunctionList;
    postFilters: FunctionList;

    /*
     * Finds the math within the DOM or the list of strings
     *
     * @param{Element | string[]} which  The element or array of strings to be searched for math
     * @param{OptionList} options        The options for the search, if any
     * @return{ProtoItem[]}              Array of proto math items found (further processed by the
     *                                     handler to produce actual MathItem objects)
     */
    findMath(which: Element | string[], options?: OptionList): ProtoItem[];

    /*
     * Convert the math in a math item into the internal format
     *
     * @param{MathItem} math  The MathItem whose math content is to processed
     * @return{MmlNode}       The resulting internal node tree for the math
     */
    compile(math: MathItem): MmlNode;
}

/*****************************************************************/
/*
 *  The abstract InputJax class
 */

export abstract class AbstractInputJax implements InputJax {

    public static NAME: string = 'generic';
    public static OPTIONS: OptionList = {};

    public options: OptionList;
    public preFilters: FunctionList;
    public postFilters: FunctionList;

    /*
     * @param{OptionList} options  The options to applyt to this input jax
     *
     * @constructor
     */
    constructor(options: OptionList = {}) {
        let CLASS = this.constructor as typeof AbstractInputJax;
        this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
        this.preFilters = new FunctionList();
        this.postFilters = new FunctionList();
    }

    /*
     * @return{string}  The name of this input jax class
     */
    public get name() {
        return (this.constructor as typeof AbstractInputJax).NAME;
    }

    /*
     * @return{boolean}  True means find math in string array, false means in DOM element
     */
    public get processStrings() {
        return true;
    }

    /*
     * @override
     */
    public findMath(node: Element | string[], options: OptionList) {
        return [] as ProtoItem[];
    }

    /*
     * @override
     */
    public abstract compile(math: MathItem): MmlNode;

    /*
     * Execute a set of filters, passing them the MathItem and any needed data,
     *  and return the (possibly modified) data
     *
     * @param{FunctionList} filters  The list of functions to be performed
     * @param{MathItem} math         The math item that is being processed
     * @param{any} data              Whatever other data is needed
     * @return{any}                  The (possibly modidied) data
     */
    protected executeFilters(filters: FunctionList, math: MathItem, data: any) {
        let args = {math: math, data: data};
        filters.execute(args);
        return args.data;
    }

}
