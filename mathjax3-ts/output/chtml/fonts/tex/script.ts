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
import {script as font} from '../../../common/fonts/tex/script.js';

export const script: CharMap = AddCSS(font, {
    0x41: 3,
    0x42: 3,
    0x43: 3,
    0x44: 3,
    0x45: 3,
    0x46: 3,
    0x47: 3,
    0x48: 3,
    0x49: 3,
    0x4A: 3,
    0x4B: 3,
    0x4C: 3,
    0x4D: 3,
    0x4E: 3,
    0x4F: 3,
    0x50: 3,
    0x51: 3,
    0x52: 3,
    0x53: 3,
    0x54: 3,
    0x55: 3,
    0x56: 3,
    0x57: 3,
    0x58: 3,
    0x59: 3,
    0x5A: 3,
    0x210B: 7,
    0x2110: 7,
    0x2112: 7,
    0x211B: 7,
    0x212C: 7,
    0x2130: 7,
    0x2131: 7,
    0x2133: 7,
},{
    0x391: {f: ''},
    0x392: {f: ''},
    0x395: {f: ''},
    0x396: {f: ''},
    0x397: {f: ''},
    0x399: {f: ''},
    0x39A: {f: ''},
    0x39C: {f: ''},
    0x39D: {f: ''},
    0x39F: {f: ''},
    0x3A1: {f: ''},
    0x3A2: {f: ''},
    0x3A4: {f: ''},
    0x3A7: {f: ''},
    0x3D2: {f: ''},
    0x3DC: {f: ''},
    0x210B: {c: 'H', f: 'SC'},
    0x2110: {c: 'J', f: 'SC'},
    0x2112: {c: 'L', f: 'SC'},
    0x211B: {c: 'R', f: 'SC'},
    0x212C: {c: 'B', f: 'SC'},
    0x2130: {c: 'E', f: 'SC'},
    0x2131: {c: 'F', f: 'SC'},
    0x2133: {c: 'M', f: 'SC'},
});
