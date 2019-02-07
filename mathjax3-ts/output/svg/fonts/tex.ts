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

import {FontData, DelimiterData, CharData, CharOptions, DelimiterMap, CharMapMap, CSS, V, H} from '../FontData.js';
import {StyleList, StyleData} from '../../common/CssStyles.js';
import {em} from '../../../util/lengths.js';
import {OptionList, defaultOptions, userOptions} from '../../../util/Options.js';
import {StringMap} from '../Wrapper.js';
import {DIRECTION} from '../FontData.js';

import {boldItalic} from './tex/bold-italic.js';
import {bold} from './tex/bold.js';
import {doubleStruck} from './tex/double-struck.js';
import {frakturBold} from './tex/fraktur-bold.js';
import {fraktur} from './tex/fraktur.js';
import {italic} from './tex/italic.js';
import {largeop} from './tex/largeop.js';
import {monospace} from './tex/monospace.js';
import {normal} from './tex/normal.js';
import {sansSerifBoldItalic} from './tex/sans-serif-bold-italic.js';
import {sansSerifBold} from './tex/sans-serif-bold.js';
import {sansSerifItalic} from './tex/sans-serif-italic.js';
import {sansSerif} from './tex/sans-serif.js';
import {scriptBold} from './tex/script-bold.js';
import {script} from './tex/script.js';
import {smallop} from './tex/smallop.js';
import {texCaligraphicBold} from './tex/tex-caligraphic-bold.js';
import {texCaligraphic} from './tex/tex-caligraphic.js';
import {texMathit} from './tex/tex-mathit.js';
import {texOldstyleBold} from './tex/tex-oldstyle-bold.js';
import {texOldstyle} from './tex/tex-oldstyle.js';
import {texSize3} from './tex/tex-size3.js';
import {texSize4} from './tex/tex-size4.js';
import {texVariant} from './tex/tex-variant.js';

import {delimiters} from '../../common/fonts/tex/delimiters.js';

/***********************************************************************************/
/**
 *  The TeXFont class
 */
export class TeXFont extends FontData {

    /**
     *  Add the extra variants for the TeX fonts
     */
    protected static defaultVariants = FontData.defaultVariants.concat([
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
    ]);

    /**
     *  The stretchy delimiter data (incomplete at the moment)
     */
    protected static defaultDelimiters: DelimiterMap = delimiters;

    /**
     *  The default variants for the standard stretchy sizes
     */
    protected static defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'];

    /**
     *  The character data by variant
     */
    protected static defaultChars: CharMapMap = {
        'normal': normal,
        'bold': bold,
        'italic': italic,
        'bold-italic': boldItalic,
        'double-struck': doubleStruck,
        'fraktur': fraktur,
        'bold-fraktur': frakturBold,
        'script': script,
        'bold-script': scriptBold,
        'sans-serif': sansSerif,
        'bold-sans-serif': sansSerifBold,
        'sans-serif-italic': sansSerifItalic,
        'bold-sans-serif-italic': sansSerifBoldItalic,
        'monospace': monospace,
        '-smallop': smallop,
        '-largeop': largeop,
        '-size3': texSize3,
        '-size4': texSize4,
        '-tex-caligraphic': texCaligraphic,
        '-tex-bold-caligraphic': texCaligraphicBold,
        '-tex-mathit': texMathit,
        '-tex-oldstyle': texOldstyle,
        '-tex-bold-oldstyle': texOldstyleBold,
        '-tex-variant': texVariant
    };

   /**
     * @return {StyleList}  no styles needed for SVG
     */
    get styles() {
        return {} as StyleList;
    }

}

