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
import {texCalligraphic as font} from '../../../common/fonts/tex/tex-calligraphic.js';

export const texCalligraphic: CHTMLCharMap = AddCSS(font, {
    0x391: {c: 'A', f: 'I'},
    0x392: {c: 'B', f: 'I'},
    0x395: {c: 'E', f: 'I'},
    0x396: {c: 'Z', f: 'I'},
    0x397: {c: 'H', f: 'I'},
    0x399: {c: 'I', f: 'I'},
    0x39A: {c: 'K', f: 'I'},
    0x39C: {c: 'M', f: 'I'},
    0x39D: {c: 'N', f: 'I'},
    0x39F: {c: 'O', f: 'I'},
    0x3A1: {c: 'P', f: 'I'},
    0x3A2: {c: '\\398', f: 'I'},
    0x3A4: {c: 'T', f: 'I'},
    0x3A7: {c: 'X', f: 'I'},
    0x3D2: {c: '\\3A5', f: 'I'},
    0x3DC: {c: 'F', f: 'I'},
});
