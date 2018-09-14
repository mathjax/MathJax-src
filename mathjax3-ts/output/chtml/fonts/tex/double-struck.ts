/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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

import {CharMap, AddCSS} from '../../FontData.js';
import {doubleStruck as font} from '../../../common/fonts/tex/double-struck.js';

export const doubleStruck: CharMap = AddCSS(font, {
    0x41: 1,
    0x42: 1,
    0x44: 1,
    0x45: 1,
    0x46: 1,
    0x47: 1,
    0x48: 1,
    0x49: 1,
    0x4A: 3,
    0x4C: 1,
    0x4D: 1,
    0x4E: 3,
    0x50: 1,
    0x51: 2,
    0x52: 3,
    0x53: 2,
    0x54: 3,
    0x55: 1,
    0x56: 1,
    0x57: 1,
    0x58: 1,
    0x59: 1,
    0x5A: 1,
    0x6B: 3,
    0x2102: 7,
    0x210D: 7,
    0x2115: 7,
    0x2119: 7,
    0x211A: 7,
    0x211D: 7,
    0x2124: 7,
},{
    0x391: {f: 'B'},
    0x392: {f: 'B'},
    0x395: {f: 'B'},
    0x396: {f: 'B'},
    0x397: {f: 'B'},
    0x399: {f: 'B'},
    0x39A: {f: 'B'},
    0x39C: {f: 'B'},
    0x39D: {f: 'B'},
    0x39F: {f: 'B'},
    0x3A1: {f: 'B'},
    0x3A2: {f: 'B'},
    0x3A4: {f: 'B'},
    0x3A7: {f: 'B'},
    0x3D2: {f: 'B'},
    0x3DC: {f: 'B'},
    0x2102: {c: 'C', f: 'A'},
    0x210D: {c: 'H', f: 'A'},
    0x2115: {c: 'N', f: 'A'},
    0x2119: {c: 'P', f: 'A'},
    0x211A: {c: 'Q', f: 'A'},
    0x211D: {c: 'R', f: 'A'},
    0x2124: {c: 'Z', f: 'A'},
});
