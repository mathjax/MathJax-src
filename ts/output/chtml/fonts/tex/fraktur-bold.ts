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
import {frakturBold as font} from '../../../common/fonts/tex/fraktur-bold.js';

export const frakturBold: CHTMLCharMap = AddCSS(font, {
    0x391: {c: 'A', f: 'B'},
    0x392: {c: 'B', f: 'B'},
    0x395: {c: 'E', f: 'B'},
    0x396: {c: 'Z', f: 'B'},
    0x397: {c: 'H', f: 'B'},
    0x399: {c: 'I', f: 'B'},
    0x39A: {c: 'K', f: 'B'},
    0x39C: {c: 'M', f: 'B'},
    0x39D: {c: 'N', f: 'B'},
    0x39F: {c: 'O', f: 'B'},
    0x3A1: {c: 'P', f: 'B'},
    0x3A2: {c: '\\398', f: 'B'},
    0x3A4: {c: 'T', f: 'B'},
    0x3A7: {c: 'X', f: 'B'},
    0x3D2: {c: '\\3A5', f: 'B'},
    0x3DC: {c: 'F', f: 'B'},
    0x2044: {c: '/'},
});
