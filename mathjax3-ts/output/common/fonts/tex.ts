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
 * @fileoverview  The MathJax TeXFont object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {FontData, CssFontMap} from '../FontData.js';
import {StyleList} from '../../common/CssStyles.js';
import {em} from '../../../util/lengths.js';
import {StringMap} from '../Wrapper.js';

/***********************************************************************************/
/**
 *  The TeXFont class
 */
export class CommonTeXFont extends FontData {

    /**
     *  Add the extra variants for the TeX fonts
     */
    protected static defaultVariants = [
        ...FontData.defaultVariants,
        ['-smallop', 'normal'],
        ['-largeop', 'normal'],
        ['-size3', 'normal'],
        ['-size4', 'normal'],
        ['-tex-caligraphic', 'italic'],
        ['-tex-bold-caligraphic', 'bold-italic'],
        ['-tex-oldstyle', 'normal'],
        ['-tex-bold-oldstyle', 'bold'],
        ['-tex-mathit', 'italic'],
        ['-tex-variant', 'normal']
    ];

    protected static defaultCssFonts: CssFontMap = {
        ...FontData.defaultCssFonts,
        '-tex-caligraphic': ['cursive', true, false],
        '-tex-bold-caligraphic': ['cursive', true, true],
        '-tex-oldstyle': ['serif', false, false],
        '-tex-bold-oldstyle': ['serif', false, true],
        '-tex-mathit': ['serif', true, false]
    };

    /**
     * The classes to use for each variant
     */
    protected static defaultVariantClasses: StringMap = {
    };

    /**
     *  The default variants for the standard stretchy sizes
     */
    protected static defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'];

    /**
     * @return {StyleList}  The (computed) styles for this font
     */
    get styles() {
        return {} as StyleList;
    }

    /**
     * @param {number} n  The number of ems
     * @return {string}   The string representing the number with units of "em"
     */
    protected em(n: number) {
        return em(n);
    }

    /**
     * @param {number} n  The number of ems (will be restricted to non-negative values)
     * @return {string}   The string representing the number with units of "em"
     */
    protected em0(n: number) {
        return em(Math.max(0, n));
    }

    /**
     * @param {number} n    The character number to find
     * @return {CharData}   The data for that character to be used for stretchy delimiters
     */
    protected getDelimiterData(n: number) {
        return this.getChar('-smallop', n) || this.getChar('-size4', n);
    }

}

