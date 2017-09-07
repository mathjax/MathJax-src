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

import {FontData, DelimiterMap, CharMapMap, V, H} from '../FontData.js';


/*
 * NOTE:  This is just a small amount of the needed data, which will be filled out
 *        further later.
 */

/*
 * The standard heights of vertically stretchy delimiters (most are the same), and
 * the standard height, depth, width data for vertically stretchy delimiters
 */
const STDVSIZES = [1, 1.2, 1.8, 2.4, 3];
const STDVHDW = [.75, .25, .5];

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
        ['-tex-caligraphic', 'normal'],
        ['-tex-bold-caligraphic', 'bold', 'caligraphic'],
        ['-tex-oldstyle', 'normal'],
        ['-tex-mathit', 'italic']
    ]);

    /*
     *  The stretchy delimiter data (incomplete at the moment)
     */
    protected static defaultDelimiters: DelimiterMap = {
        0x28: {dir: V, sizes: STDVSIZES, stretch: [0x239B, 0x239C, 0x239D], HDW: STDVHDW}, // (
        0x29: {dir: V, sizes: STDVSIZES, stretch: [0x239E, 0x239F, 0x23A0], HDW: STDVHDW}, // )
        0x2F: {dir: V, sizes: STDVSIZES},                                                  // /
        0x5B: {dir: V, sizes: STDVSIZES, stretch: [0x23A1, 0x23A2, 0x23A3], HDW: STDVHDW}, // [
        0x5C: {dir: V, sizes: STDVSIZES},                                                  // \
        0x5D: {dir: V, sizes: STDVSIZES, stretch: [0x23A4, 0x23A5, 0x23A6], HDW: STDVHDW}, // ]
        0x7B: {dir: V, sizes: STDVSIZES, stretch: [0x23A7, 0x23AA, 0x23A9, 0x23A8], HDW: STDVHDW}, // {
        0x7C: {dir: V, sizes: [1], stretch: [0, 0x2223, 0], HDW: STDVHDW},                 // |
        0x7D: {dir: V, sizes: STDVSIZES, stretch: [0x23AB, 0x23AA, 0x23AD, 0x23AC], HDW: STDVHDW}, // }
    };

    /*
     *  The default variants for the standard stretchy sizes
     */
    protected static defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'];

    /*
     *  The character data by variant
     */
    protected static defaultChars: CharMapMap = {
        'normal': {
            0x20: [   0,     0, .25],      // SPACE
            0x21: [.716,     0, .278],     // EXCLAMATION MARK
            0x22: [.694, -.379, .5],       // QUOTATION MARK
            0x23: [.694,  .194, .833],     // NUMBER SIGN
            0x24: [.75,   .056, .5],       // DOLLAR SIGN
            0x25: [.75,   .056, .833],     // PERCENT SIGN
            0x26: [.716,  .022, .778],     // AMPERSAND
            0x27: [.694, -.379, .278],     // APOSTROPHE
            0x28: [.75,   .25,  .389],     // LEFT PARENTHESIS
            0x29: [.75,   .25,  .389],     // RIGHT PARENTHESIS
            0x2A: [.75,  -.32,  .5],       // ASTERISK
            0x2B: [.583,  .082, .778],     // PLUS SIGN
            0x2C: [.121,  .194, .278],     // COMMA
            0x2D: [.252, -.179, .333],     // HYPHEN-MINUS
            0x2E: [.12,      0, .278],     // FULL STOP
            0x2F: [.75,   .25,  .5],       // SOLIDUS
            0x30: [.666,  .022, .5],       // DIGIT ZERO
            0x31: [.666,     0, .5],       // DIGIT ONE
            0x32: [.666,     0, .5],       // DIGIT TWO
            0x33: [.665,  .022, .5],       // DIGIT THREE
            0x34: [.677,     0, .5],       // DIGIT FOUR
            0x35: [.666,  .022, .5],       // DIGIT FIVE
            0x36: [.666,  .022, .5],       // DIGIT SIX
            0x37: [.676,  .022, .5],       // DIGIT SEVEN
            0x38: [.666,  .022, .5],       // DIGIT EIGHT
            0x39: [.666,  .022, .5],       // DIGIT NINE
            0x3A: [.43,      0, .278],     // COLON
            0x3B: [.43,   .194, .278],     // SEMICOLON
            0x3C: [.54,   .04,  .778],     // LESS-THAN SIGN
            0x3D: [.367, -.133, .778],     // EQUALS SIGN
            0x3E: [.54,   .04,  .778],     // GREATER-THAN SIGN
            0x3F: [.705,     0, .472],     // QUESTION MARK
            0x40: [.705,  .011, .778],     // COMMERCIAL AT
            0x41: [.716,     0, .75],      // LATIN CAPITAL LETTER A
            0x42: [.683,     0, .708],     // LATIN CAPITAL LETTER B
            0x43: [.705,  .021, .722],     // LATIN CAPITAL LETTER C
            0x44: [.683,     0, .764],     // LATIN CAPITAL LETTER D
            0x45: [.68,      0, .681],     // LATIN CAPITAL LETTER E
            0x46: [.68,      0, .653],     // LATIN CAPITAL LETTER F
            0x47: [.705,  .022, .785],     // LATIN CAPITAL LETTER G
            0x48: [.683,     0, .750],     // LATIN CAPITAL LETTER H
            0x49: [.683,     0, .361],     // LATIN CAPITAL LETTER I
            0x4A: [.683,  .022, .514],     // LATIN CAPITAL LETTER J
            0x4B: [.683,     0, .778],     // LATIN CAPITAL LETTER K
            0x4C: [.683,     0, .625],     // LATIN CAPITAL LETTER L
            0x4D: [.683,     0, .917],     // LATIN CAPITAL LETTER M
            0x4E: [.683,     0, .75],      // LATIN CAPITAL LETTER N
            0x4F: [.705,  .022, .778],     // LATIN CAPITAL LETTER O
            0x50: [.683,     0, .681],     // LATIN CAPITAL LETTER P
            0x51: [.705,  .193, .778],     // LATIN CAPITAL LETTER Q
            0x52: [.683,  .022, .736],     // LATIN CAPITAL LETTER R
            0x53: [.705,  .022, .556],     // LATIN CAPITAL LETTER S
            0x54: [.677,     0, .722],     // LATIN CAPITAL LETTER T
            0x55: [.683,  .022, .75],      // LATIN CAPITAL LETTER U
            0x56: [.683,  .022, .75],      // LATIN CAPITAL LETTER V
            0x57: [.683,  .022, .1028],    // LATIN CAPITAL LETTER W
            0x58: [.683,     0, .75],      // LATIN CAPITAL LETTER X
            0x59: [.683,     0, .75],      // LATIN CAPITAL LETTER Y
            0x5A: [.683,     0, .611],     // LATIN CAPITAL LETTER Z
            0x5B: [.75,   .25,  .278],     // LEFT SQUARE BRACKET
            0x5C: [.75,   .25,  .5],       // REVERSE SOLIDUS
            0x5D: [.75,   .25,  .278],     // RIGHT SQUARE BRACKET
            0x5E: [.694, -.531, .5],       // CIRCUMFLEX ACCENT
            0x5F: [-.025, .062, .5],       // LOW LINE
            0x60: [.699, -.505, .5],       // GRAVE ACCENT
            0x61: [.448,  .011, .5],       // LATIN SMALL LETTER A
            0x62: [.694,  .011, .556],     // LATIN SMALL LETTER B
            0x63: [.448,  .011, .444],     // LATIN SMALL LETTER C
            0x64: [.694,  .011, .556],     // LATIN SMALL LETTER D
            0x65: [.448,  .011, .444],     // LATIN SMALL LETTER E
            0x66: [.705,     0, .306],     // LATIN SMALL LETTER F
            0x67: [.453,  .206, .5],       // LATIN SMALL LETTER G
            0x68: [.694,     0, .556],     // LATIN SMALL LETTER H
            0x69: [.669,     0, .278],     // LATIN SMALL LETTER I
            0x6A: [.669,  .205, .306],     // LATIN SMALL LETTER J
            0x6B: [.694,     0, .528],     // LATIN SMALL LETTER K
            0x6C: [.694,     0, .278],     // LATIN SMALL LETTER L
            0x6D: [.442,     0, .833],     // LATIN SMALL LETTER M
            0x6E: [.442,     0, .556],     // LATIN SMALL LETTER N
            0x6F: [.448,  .010, .5],       // LATIN SMALL LETTER O
            0x70: [.442,  .194, .556],     // LATIN SMALL LETTER P
            0x71: [.442,  .194, .528],     // LATIN SMALL LETTER Q
            0x72: [.442,     0, .392],     // LATIN SMALL LETTER R
            0x73: [.448,  .011, .394],     // LATIN SMALL LETTER S
            0x74: [.615,  .010, .389],     // LATIN SMALL LETTER T
            0x75: [.442,  .011, .556],     // LATIN SMALL LETTER U
            0x76: [.431,  .011, .528],     // LATIN SMALL LETTER V
            0x77: [.431,  .011, .722],     // LATIN SMALL LETTER W
            0x78: [.431,     0, .528],     // LATIN SMALL LETTER X
            0x79: [.431,  .204, .528],     // LATIN SMALL LETTER Y
            0x7A: [.431,     0, .444],     // LATIN SMALL LETTER Z
            0x7B: [.75,   .25,  .5],       // LEFT CURLY BRACKET
            0x7C: [.75,   .249, .278],     // VERTICAL LINE
            0x7D: [.75,   .25,  .5],       // RIGHT CURLY BRACKET
        }
    };

}
