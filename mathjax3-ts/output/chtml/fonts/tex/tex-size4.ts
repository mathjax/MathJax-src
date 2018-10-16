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
import {texSize4 as font} from '../../../common/fonts/tex/tex-size4.js';

export const texSize4: CharMap = AddCSS(font, {
    0x28: 3,
    0x29: 3,
    0x2F: 3,
    0x5B: 3,
    0x5C: 3,
    0x5D: 3,
    0x7B: 3,
    0x7D: 3,
    0x2C6: 3,
    0x2DC: 3,
    0x302: 2,
    0x303: 2,
    0x2044: 3,
    0x221A: 3,
    0x2308: 3,
    0x2309: 3,
    0x230A: 3,
    0x230B: 3,
    0x2329: 3,
    0x232A: 3,
    0x239B: 7,
    0x239C: 7,
    0x239D: 7,
    0x239E: 7,
    0x239F: 7,
    0x23A0: 7,
    0x23A1: 7,
    0x23A2: 7,
    0x23A3: 7,
    0x23A4: 7,
    0x23A5: 7,
    0x23A6: 7,
    0x23A7: 7,
    0x23A8: 7,
    0x23A9: 7,
    0x23AA: 7,
    0x23AB: 7,
    0x23AC: 7,
    0x23AD: 7,
    0x23B7: 7,
    0x27E8: 3,
    0x27E9: 3,
    0x3008: 3,
    0x3009: 3,
    0xE000: 7,
    0xE001: 7,
    0xE150: 7,
    0xE151: 7,
    0xE152: 7,
    0xE153: 7,
    0xE154: 7,
    0xE155: 7,
    0xE156: 7,
},{
    0xE155: {c: '\\E153\\E152'},
    0xE156: {c: '\\E151\\E150'},
});
