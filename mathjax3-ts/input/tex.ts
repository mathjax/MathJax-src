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
import {NewTex} from './tex/Translate.js';
import {separateOptions, OptionList} from '../util/Options.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';

import {FindTeX} from './tex/FindTeX.js';

/*****************************************************************/
/*
 *  Implements the TeX class (extends AbstractInputJax)
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class TeX<N, T, D> extends AbstractInputJax<N, T, D> {

    public static NAME: string = 'TeX';
    public static OPTIONS: OptionList = {
        ...AbstractInputJax.OPTIONS,
      FindTeX: null,
      packages: ['base'],
      settings: {
        //  This specifies the side on which \tag{} macros will place the tags.
        //  Set to 'left' to place on the left-hand side.
        TagSide: 'right',
        //  This is the amound of indentation (from right or left) for the tags.
        TagIndent: '0.8em',
        //  This is the width to use for the multline environment
        MultLineWidth: '85%',
        // make element ID's use \label name rather than equation number
        // MJ puts in an equation prefix: mjx-eqn
        // When true it uses the label name XXX as mjx-eqn-XXX
        // If false it uses the actual number N that is displayed: mjx-eqn-N
        useLabelIds: true,
        refUpdate: false
      },
      // Tagging style.
      tags: 'none'
    };

    /**
     * The FindTeX instance used for locating TeX in strings
     */
    protected findTeX: FindTeX<N, T, D>;

    /**
     * @override
     */
    constructor(options: OptionList) {
        let [tex, find] = separateOptions(options, FindTeX.OPTIONS);
        super(tex);
        this.findTeX = this.options['FindTeX'] || new FindTeX(find);
    }

    /**
     * @override
     */
  public compile(math: MathItem<N, T, D>): MmlNode {
    console.log(this.options['packages']);
    console.log(this.options['settings']);
    console.log(this.options['tags']);
    return NewTex.Compile(math.math, math.display,
                          this.options['packages'], this.options['settings']);
    }

    /**
     * @override
     */
    public findMath(strings: string[]) {
        return this.findTeX.findMath(strings);
    }

}
