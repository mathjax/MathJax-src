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
import {doubleStruck as font} from '../../../common/fonts/tex/double-struck.js';

export const doubleStruck: CHTMLCharMap = AddCSS(font, {
    0x2102: {c: 'C'},
    0x210D: {c: 'H'},
    0x2115: {c: 'N'},
    0x2119: {c: 'P'},
    0x211A: {c: 'Q'},
    0x211D: {c: 'R'},
    0x2124: {c: 'Z'},
});
