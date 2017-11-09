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
 * @fileoverview  Implements the TeX InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractInputJax} from '../core/InputJax.js';
// import {LegacyTeX} from '../../mathjax2/input/TeX.js';
import {NewTex} from './tex/Translate.js';
import {separateOptions, OptionList} from '../util/Options.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js'

import {FindTeX} from './tex/FindTeX.js';

/*****************************************************************/
/*
 *  Implements the TeX class (extends AbstractInputJax)
 */

export class TeX extends AbstractInputJax {

    public static NAME: string = 'TeX';
    public static OPTIONS: OptionList = {
        ...AbstractInputJax.OPTIONS,
        FindTeX: null
    };

    /*
     * The FindTeX instance used for locating TeX in strings
     */
    protected findTeX: FindTeX;

    /*
     * @override
     */
    constructor(options: OptionList) {
        let [tex, find] = separateOptions(options, FindTeX.OPTIONS);
        super(tex);
        this.findTeX = this.options['FindTeX'] || new FindTeX(find);
    }

    /*
     * Use the legacy TeX input jax for now
     *
     * @override
     */
    public compile(math: MathItem): MmlNode {
        // return LegacyTeX.Compile(math.math, math.display);
        return NewTex.Compile(math.math, math.display);
    }

    /*
     * @override
     */
    public findMath(strings: string[]) {
        return this.findTeX.findMath(strings);
    }

}
