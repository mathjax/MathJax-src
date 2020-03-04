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
import {texCalligraphicBold as font} from '../../../common/fonts/tex/tex-calligraphic-bold.js';

export const texCalligraphicBold: CHTMLCharMap = AddCSS(font, {
    0x391: {c: 'A', f: 'BI'},
    0x392: {c: 'B', f: 'BI'},
    0x395: {c: 'E', f: 'BI'},
    0x396: {c: 'Z', f: 'BI'},
    0x397: {c: 'H', f: 'BI'},
    0x399: {c: 'I', f: 'BI'},
    0x39A: {c: 'K', f: 'BI'},
    0x39C: {c: 'M', f: 'BI'},
    0x39D: {c: 'N', f: 'BI'},
    0x39F: {c: 'O', f: 'BI'},
    0x3A1: {c: 'P', f: 'BI'},
    0x3A2: {c: '\\398', f: 'BI'},
    0x3A4: {c: 'T', f: 'BI'},
    0x3A7: {c: 'X', f: 'BI'},
    0x3D2: {c: '\\3A5', f: 'BI'},
    0x3DC: {c: 'F', f: 'BI'},
    0x2044: {c: '/'},
    0x2206: {c: '\\394'},
});
