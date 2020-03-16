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
    0x210B: {c: 'H', f: 'SC'},
    0x2110: {c: 'J', f: 'SC'},
    0x2112: {c: 'L', f: 'SC'},
    0x211B: {c: 'R', f: 'SC'},
    0x212C: {c: 'B', f: 'SC'},
    0x2130: {c: 'E', f: 'SC'},
    0x2131: {c: 'F', f: 'SC'},
    0x2133: {c: 'M', f: 'SC'},
});
