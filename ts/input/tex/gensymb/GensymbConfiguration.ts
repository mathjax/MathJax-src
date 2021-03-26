/*************************************************************
 *
 *  Copyright (c) 2021 The MathJax Consortium
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


/**
 * @fileoverview Configuration file for the gensymb package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import ParseMethods from '../ParseMethods.js';
import {TexConstant} from '../TexConstants.js';
import {CharacterMap} from '../SymbolMap.js';


/**
 * Ohm symbol as in gensymb. Usually upright, but can be affected by fonts.
 */
new CharacterMap('gensymb-ohm', ParseMethods.mathchar7, {
  ohm:            '\u03A9'
});


/**
 * Remaining symbols from the gensymb package are all in \rm font only.
 */
new CharacterMap('gensymb-rest', ParseMethods.mathchar0mo, {
  degree:         ['\u00B0', {mathvariant: TexConstant.Variant.NORMAL}],
  celsius:        ['\u2103', {mathvariant: TexConstant.Variant.NORMAL}],
  perthousand:    ['\u2030', {mathvariant: TexConstant.Variant.NORMAL}],
  micro:          ['\u00B5', {mathvariant: TexConstant.Variant.NORMAL}]
});


export const GensymbConfiguration = Configuration.create(
  'gensymb', {
    handler: {macro: ['gensymb-ohm', 'gensymb-rest']},
  }
);

