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
import {texOldstyle as font} from '../../../common/fonts/tex/tex-oldstyle.js';

export const texOldstyle: CharMap = AddCSS(font, {
    0x30: 2,
    0x31: 2,
    0x32: 2,
    0x33: 2,
    0x34: 2,
    0x35: 2,
    0x37: 2,
    0x39: 2,
    0x41: 3,
    0x42: 3,
    0x43: 1,
    0x44: 1,
    0x45: 3,
    0x46: 3,
    0x47: 3,
    0x48: 3,
    0x49: 1,
    0x4A: 3,
    0x4B: 3,
    0x4C: 3,
    0x4D: 3,
    0x4E: 3,
    0x4F: 1,
    0x50: 3,
    0x51: 3,
    0x52: 1,
    0x53: 1,
    0x54: 3,
    0x55: 3,
    0x56: 3,
    0x57: 3,
    0x58: 1,
    0x59: 3,
    0x5A: 1,
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
});
