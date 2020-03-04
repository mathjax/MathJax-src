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
import {fraktur as font} from '../../../common/fonts/tex/fraktur.js';

export const fraktur: CHTMLCharMap = AddCSS(font, {
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
    0x2044: {c: '/'},
    0x210C: {c: 'H', f: 'FR'},
    0x2111: {c: 'I', f: 'FR'},
    0x211C: {c: 'R', f: 'FR'},
    0x2128: {c: 'Z', f: 'FR'},
    0x212D: {c: 'C', f: 'FR'},
});
