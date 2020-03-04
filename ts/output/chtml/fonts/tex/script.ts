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
import {script as font} from '../../../common/fonts/tex/script.js';

export const script: CHTMLCharMap = AddCSS(font, {
    0x391: {c: 'A', f: ''},
    0x392: {c: 'B', f: ''},
    0x395: {c: 'E', f: ''},
    0x396: {c: 'Z', f: ''},
    0x397: {c: 'H', f: ''},
    0x399: {c: 'I', f: ''},
    0x39A: {c: 'K', f: ''},
    0x39C: {c: 'M', f: ''},
    0x39D: {c: 'N', f: ''},
    0x39F: {c: 'O', f: ''},
    0x3A1: {c: 'P', f: ''},
    0x3A2: {c: '\\398', f: ''},
    0x3A4: {c: 'T', f: ''},
    0x3A7: {c: 'X', f: ''},
    0x3D2: {c: '\\3A5', f: ''},
    0x3DC: {c: 'F', f: ''},
    0x210B: {c: 'H', f: 'SC'},
    0x2110: {c: 'J', f: 'SC'},
    0x2112: {c: 'L', f: 'SC'},
    0x211B: {c: 'R', f: 'SC'},
    0x212C: {c: 'B', f: 'SC'},
    0x2130: {c: 'E', f: 'SC'},
    0x2131: {c: 'F', f: 'SC'},
    0x2133: {c: 'M', f: 'SC'},
});
