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
import {CHTMLCharMap, AddCSS} from '../../FontData.js';
import {doubleStruck as font} from '../../../common/fonts/tex/double-struck.js';

export const doubleStruck: CHTMLCharMap = AddCSS(font, {
    0x2C6: {f: 'B'},
    0x2DC: {f: 'B'},
    0x302: {f: 'B'},
    0x303: {f: 'B'},
    0x2102: {c: 'C', f: 'A'},
    0x210D: {c: 'H', f: 'A'},
    0x210F: {f: 'B'},
    0x2115: {c: 'N', f: 'A'},
    0x2119: {c: 'P', f: 'A'},
    0x211A: {c: 'Q', f: 'A'},
    0x211D: {c: 'R', f: 'A'},
    0x2124: {c: 'Z', f: 'A'},
    0x2190: {f: 'B'},
    0x2192: {f: 'B'},
    0x219A: {f: 'B'},
    0x219B: {f: 'B'},
    0x21AE: {f: 'B'},
    0x21CC: {f: 'B'},
    0x2205: {f: 'B'},
    0x2212: {f: 'B'},
    0x2216: {f: 'B'},
    0x221D: {f: 'B'},
    0x2220: {f: 'B'},
    0x2223: {f: 'B'},
    0x2224: {f: 'B'},
    0x2225: {f: 'B'},
    0x2226: {f: 'B'},
    0x223C: {f: 'B'},
    0x2241: {f: 'B'},
    0x2248: {f: 'B'},
    0x22A8: {f: 'B'},
    0x22AC: {f: 'B'},
    0x22AD: {f: 'B'},
    0x22C5: {f: 'B'},
    0x2322: {f: 'B'},
    0x2323: {f: 'B'},
    0x25B3: {f: 'B'},
    0x25BD: {f: 'B'},
});
