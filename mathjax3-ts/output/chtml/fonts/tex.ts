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
import {StyleList, StyleData} from '../CssStyles.js';
import {em} from '../../../util/lengths.js';
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

import {delimiters} from './tex/delimiters.js';

/***********************************************************************************/
/*
 *  The TeXFont class
 */
export class TeXFont extends FontData {
    /*
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

    /*
     * The classes to use for each variant
     */
    protected static defaultVariantClasses: StringMap = {
        'normal': 'mjx-n',
        'bold': 'mjx-b',
        'italic': 'mjx-i',
        'bold-italic': 'mjx-b mjx-i',
        'double-struck': 'mjx-ds',
        'fraktur': 'mjx-fr',
        'bold-fraktur': 'mjx-fr mjx-b',
        'script': 'mjx-sc',
        'bold-script': 'mjx-sc mjx-b',
        'sans-serif': 'mjx-ss',
        'bold-sans-serif': 'mjx-ss mjx-b',
        'sans-serif-italic': 'mjx-ss mjx-i',
        'bold-sans-serif-italic': 'mjx-ss mjx-b mjx-i',
        'monospace': 'mjx-ty',
        '-smallop': 'mjx-sop',
        '-largeop': 'mjx-lop',
        '-size3': 'mjx-s3',
        '-size4': 'mjx-s4',
        '-tex-caligraphic': 'mjx-cal',
        '-tex-bold-caligraphic': 'mjx-cal mjx-b',
        '-tex-mathit': 'mjx-mit',
        '-tex-oldstyle': 'mjx-os',
        '-tex-bold-oldstyle': 'mjx-os mjx-b',
        '-tex-variant': 'mjx-v'
    };

    /*
     *  The stretchy delimiter data (incomplete at the moment)
     */
    protected static defaultDelimiters: DelimiterMap = delimiters;

    /*
     *  The default variants for the standard stretchy sizes
     */
    protected static defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'];

    /*
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

    /*
     * The CSS styles needed for this font.
     */
    protected static defaultStyles = {
        '.MJX-TEX .mjx-n mjx-c': {
            'font-family': 'MJXZERO, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-i mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-b mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-b.mjx-i mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-BI, MJXTEX-B, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-cal mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-C, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-cal.mjx-b mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-C-B, MJXTEX-C, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-ds mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-A, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1'
        },

        '.MJX-TEX .mjx-fr mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-FR, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-fr.mjx-b mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-FR-B, MJXTEX-FR, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-sc mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-SC, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-sc.mjx-b mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-SC-B, MJXTEX-SC, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-ss mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-SS, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-ss.mjx-b mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-SS-B, MJXTEX-SS, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-ss.mjx-i mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-SS-I, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-ss.mjx-b.mjx-i mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-SS-B, MJXTEX-SS-I, MJXTEX-BI, MJXTEX-B, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-ty mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-T, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-var mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-A, MJXTEX, MJXTEX-I, MJXTEX-S1'
        },

        '.MJX-TEX .mjx-os mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-C, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },
        '.MJX-TEX .mjx-os.mjx-b mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-C-B, MJXTEX-C, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-mit mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-MI, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-lop mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-S2, MJXTEX-S1, MJXTEX, MJXTEX-I, MJXTEX-A'
        },

        '.MJX-TEX .mjx-sop mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-S1, MJXTEX, MJXTEX-I, MJXTEX-A'
        },

        '.MJX-TEX .mjx-s3 mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-S3, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX .mjx-s4 mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-S4, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
        },

        '.MJX-TEX': {
            'font-family': 'MJXZERO'
        },

        '.MJX-TEX mjx-stretchy-v mjx-c, .MJX-TEX mjx-stretchy-h mjx-c': {
            'font-family': 'MJXZERO, MJXTEX, MJXTEX-S4 ! important'
        },

        '@font-face /* 0 */': {
            'font-family': 'MJXZERO',
            src: 'url("mathjax2/css/otf/MathJax_Zero.otf") format("opentype")'
        },

        '@font-face /* 1 */': {
            'font-family': 'MJXTEX',
            src: 'url("mathjax2/css/woff/MathJax_Main-Regular.woff") format("woff")'
        },

        '@font-face /* 2 */': {
            'font-family': 'MJXTEX-B',
            src: 'url("mathjax2/css/woff/MathJax_Main-Bold.woff") format("woff")'
        },

        '@font-face /* 3 */': {
            'font-family': 'MJXTEX-MI',
            src: 'url("mathjax2/css/woff/MathJax_Main-Italic.woff") format("woff")'
        },

        '@font-face /* 4 */': {
            'font-family': 'MJXTEX-I',
            src: 'url("mathjax2/css/woff/MathJax_Math-Italic.woff") format("woff")'
        },

        '@font-face /* 5 */': {
            'font-family': 'MJXTEX-BI',
            src: 'url("mathjax2/css/woff/MathJax_Math-BoldItalic.woff") format("woff")'
        },

        '@font-face /* 6 */': {
            'font-family': 'MJXTEX-S1',
            src: 'url("mathjax2/css/woff/MathJax_Size1-Regular.woff") format("woff")'
        },

        '@font-face /* 7 */': {
            'font-family': 'MJXTEX-S2',
            src: 'url("mathjax2/css/woff/MathJax_Size2-Regular.woff") format("woff")'
        },

        '@font-face /* 8 */': {
            'font-family': 'MJXTEX-S3',
            src: 'url("mathjax2/css/woff/MathJax_Size3-Regular.woff") format("woff")'
        },

        '@font-face /* 9 */': {
            'font-family': 'MJXTEX-S4',
            src: 'url("mathjax2/css/woff/MathJax_Size4-Regular.woff") format("woff")'
        },

        '@font-face /* 10 */': {
            'font-family': 'MJXTEX-A',
            src: 'url("mathjax2/css/woff/MathJax_AMS-Regular.woff") format("woff")'
        },

        '@font-face /* 11 */': {
            'font-family': 'MJXTEX-C',
            src: 'url("mathjax2/css/woff/MathJax_Caligraphic-Regular.woff") format("woff")'
        },

        '@font-face /* 12 */': {
            'font-family': 'MJXTEX-C-B',
            src: 'url("mathjax2/css/woff/MathJax_Caligraphic-Bold.woff") format("woff")'
        },

        '@font-face /* 13 */': {
            'font-family': 'MJXTEX-FR',
            src: 'url("mathjax2/css/woff/MathJax_Fraktur-Regular.woff") format("woff")'
        },

        '@font-face /* 14 */': {
            'font-family': 'MJXTEX-FR-B',
            src: 'url("mathjax2/css/woff/MathJax_Fraktur-Bold.woff") format("woff")'
        },

        '@font-face /* 15 */': {
            'font-family': 'MJXTEX-SS',
            src: 'url("mathjax2/css/woff/MathJax_SansSerif-Regular.woff") format("woff")'
        },

        '@font-face /* 16 */': {
            'font-family': 'MJXTEX-SS-B',
            src: 'url("mathjax2/css/woff/MathJax_SansSerif-Bold.woff") format("woff")'
        },

        '@font-face /* 17 */': {
            'font-family': 'MJXTEX-SS-I',
            src: 'url("mathjax2/css/woff/MathJax_SansSerif-Italic.woff") format("woff")'
        },

        '@font-face /* 18 */': {
            'font-family': 'MJXTEX-SC',
            src: 'url("mathjax2/css/woff/MathJax_Script-Regular.woff") format("woff")'
        },

        '@font-face /* 19 */': {
            'font-family': 'MJXTEX-T',
            src: 'url("mathjax2/css/woff/MathJax_Typewriter-Regular.woff") format("woff")'
        },
    };

    /*
     * @return{StyleList}  The (computed) styles for this font
     *                     (could be used to limit styles to those actually used, for example)
     */
    get styles() {
        //
        //  Include the default styles
        //
        let styles: StyleList = {...(this.constructor as typeof TeXFont).defaultStyles};
        //
        //  Create styles needed for the delimiters
        //
        for (const n of Object.keys(this.delimiters)) {
            const N = parseInt(n);
            this.addDelimiterStyles(styles, N, this.delimiters[N]);
        }
        //
        //  Create styles needed for the characters in each variant
        //
        for (const name of Object.keys(this.variant)) {
            const variant = this.variant[name];
            const vclass = (name === 'normal' ? '' : ' .' + variant.classes.replace(/ /g, '.'));
            for (const n of Object.keys(variant.chars)) {
                const N = parseInt(n);
                if (variant.chars[N].length === 4) {
                    this.addCharStyles(styles, vclass, N, variant.chars[N]);
                }
            }
        }
        return styles;
    }

    /*
     * @param{StyleList} styles    The style object to add styles to
     * @param{number} n            The unicode character number of the delimiter
     * @param{DelimiterData} data  The data for the delimiter whose CSS is to be added
     */
    protected addDelimiterStyles(styles: StyleList, n: number, data: DelimiterData) {
        if (!data.stretch) return;
        if (data.dir === DIRECTION.Vertical) {
            const c = this.char(n);
            const Hb = this.addDelimiterVPart(styles, c, 'beg', data.stretch[0]);
            this.addDelimiterVPart(styles, c, 'ext', data.stretch[1]);
            const He = this.addDelimiterVPart(styles, c, 'end', data.stretch[2]);
            const css: StyleData = {};
            if (Hb) {
                css['border-top-width'] = this.em(Math.max(0, Hb - .03));
            }
            if (He) {
                css['border-bottom-width'] = this.em(Math.max(0, He - .03));
                css['margin-bottom'] = this.em(-He);
            }
            styles['.MJX-TEX mjx-stretchy-v[c="' + c + '"] mjx-ext'] = css;
        } else {
            //  FIXME: still need to add this
        }
    }

    /*
     * @param{StyleList} styles  The style object to add styles to
     * @param{string} c          The vertical character whose part is being added
     * @param{string} part       The name of the part (beg, ext, end, mid) that is being added
     * @param{number} n          The unicode character to use for the part
     * @return{number}           The total height of the character
     */
    protected addDelimiterVPart(styles: StyleList, c: string, part: string, n: number) {
        if (!n) return 0;
        const data = this.getChar('normal', n) || this.getChar('-size4', n);
        const css: StyleData = {content: '"' + this.char(n, true) + '"'};
        if (part !== 'ext') {
            css.padding = this.em(data[0]) + ' 0 ' + this.em(data[1]);
        }
        styles['.MJX-TEX mjx-stretchy-v[c="' + c + '"] mjx-' + part + ' mjx-c::before'] = css;
        return data[0] + data[1];
    }

    /*
     * @param{StyleList} styles  The style object to add styles to
     * @param{string} vclass     The variant class string (e.g., .mjx-b) where this character is being defined
     * @param{number} n          The unicode character being defined
     * @param{CharData} data     The bounding box data and options for the character
     */
    protected addCharStyles(styles: StyleList, vclass: string, n: number, data: CharData) {
        const [h, d, w, options] = data as [number, number, number, CharOptions];
        const css: StyleData = {};
        if (options.css) {
            if (options.css & CSS.width) {
                css.width = this.em(w);
            }
            if (options.css & CSS.padding) {
                css.padding = this.em(h) + ' 0 ' + this.em(d);
            }
            if (options.css & CSS.content) {
                css.content = '"' + (options.c || this.char(n, true)) + '"';
            }
        }
        if (options.f !== undefined) css['font-family'] = 'MJXZERO, MJXTEX' + (options.f ? '-' + options.f : '');
        styles['.MJX-TEX' + vclass + ' mjx-c[c="' + this.char(n) + '"]::before'] = css;
    }

    /*
     * @param{number} n  The number of ems
     * @return{string}   The string representing the number with units of "em"
     */
    protected em(n: number) {
        return em(n);
    }

}

