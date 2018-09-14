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
import {texVariant as font} from '../../../common/fonts/tex/tex-variant.js';

export const texVariant: CharMap = AddCSS(font, {
    0x41: 3,
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
    0x2C6: 3,
    0x2DC: 3,
    0x302: 2,
    0x303: 2,
    0x3DC: 7,
    0x3F0: 4,
    0x2190: 3,
    0x2192: 3,
    0x21CC: 2,
    0x2204: 6,
    0x2205: 3,
    0x2212: 3,
    0x221D: 2,
    0x2223: 3,
    0x2224: 7,
    0x2225: 3,
    0x2226: 7,
    0x2268: 4,
    0x2269: 4,
    0x2270: 6,
    0x2271: 6,
    0x2288: 6,
    0x2289: 6,
    0x228A: 6,
    0x228B: 6,
    0x22A8: 3,
    0x22C5: 2,
    0x2322: 3,
    0x2323: 1,
    0x25B3: 3,
    0x25BD: 3,
    0x2A87: 6,
    0x2A88: 6,
    0x2ACB: 6,
    0x2ACC: 6,
},{
    0x3DC: {c: '\\E008'},
    0x3F0: {c: '\\E009'},
    0x2224: {c: '\\E006'},
    0x2226: {c: '\\E007'},
    0x2268: {c: '\\E00C'},
    0x2269: {c: '\\E00D'},
    0x2270: {c: '\\E011'},
    0x2271: {c: '\\E00E'},
    0x2288: {c: '\\E016'},
    0x2289: {c: '\\E018'},
    0x228A: {c: '\\E01A'},
    0x228B: {c: '\\E01B'},
    0x2A87: {c: '\\E010'},
    0x2A88: {c: '\\E00F'},
    0x2ACB: {c: '\\E017'},
    0x2ACC: {c: '\\E019'},
});
