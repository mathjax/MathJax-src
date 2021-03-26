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
 * @fileoverview Configuration file for the upgreek package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import ParseMethods from '../ParseMethods.js';
import {TexConstant} from '../TexConstants.js';
import {CharacterMap} from '../SymbolMap.js';


/**
 * Upright Greek characters.
 */
new CharacterMap('upgreek', ParseMethods.mathchar0mi, {
  upalpha:        ['\u03B1', {mathvariant: TexConstant.Variant.NORMAL}],
  upbeta:         ['\u03B2', {mathvariant: TexConstant.Variant.NORMAL}],
  upgamma:        ['\u03B3', {mathvariant: TexConstant.Variant.NORMAL}],
  updelta:        ['\u03B4', {mathvariant: TexConstant.Variant.NORMAL}],
  upepsilon:      ['\u03F5', {mathvariant: TexConstant.Variant.NORMAL}],
  upzeta:         ['\u03B6', {mathvariant: TexConstant.Variant.NORMAL}],
  upeta:          ['\u03B7', {mathvariant: TexConstant.Variant.NORMAL}],
  uptheta:        ['\u03B8', {mathvariant: TexConstant.Variant.NORMAL}],
  upiota:         ['\u03B9', {mathvariant: TexConstant.Variant.NORMAL}],
  upkappa:        ['\u03BA', {mathvariant: TexConstant.Variant.NORMAL}],
  uplambda:       ['\u03BB', {mathvariant: TexConstant.Variant.NORMAL}],
  upmu:           ['\u03BC', {mathvariant: TexConstant.Variant.NORMAL}],
  upnu:           ['\u03BD', {mathvariant: TexConstant.Variant.NORMAL}],
  upxi:           ['\u03BE', {mathvariant: TexConstant.Variant.NORMAL}],
  upomicron:      ['\u03BF', {mathvariant: TexConstant.Variant.NORMAL}],
  uppi:           ['\u03C0', {mathvariant: TexConstant.Variant.NORMAL}],
  uprho:          ['\u03C1', {mathvariant: TexConstant.Variant.NORMAL}],
  upsigma:        ['\u03C3', {mathvariant: TexConstant.Variant.NORMAL}],
  uptau:          ['\u03C4', {mathvariant: TexConstant.Variant.NORMAL}],
  upupsilon:      ['\u03C5', {mathvariant: TexConstant.Variant.NORMAL}],
  upphi:          ['\u03D5', {mathvariant: TexConstant.Variant.NORMAL}],
  upchi:          ['\u03C7', {mathvariant: TexConstant.Variant.NORMAL}],
  uppsi:          ['\u03C8', {mathvariant: TexConstant.Variant.NORMAL}],
  upomega:        ['\u03C9', {mathvariant: TexConstant.Variant.NORMAL}],
  upvarepsilon:   ['\u03B5', {mathvariant: TexConstant.Variant.NORMAL}],
  upvartheta:     ['\u03D1', {mathvariant: TexConstant.Variant.NORMAL}],
  upvarpi:        ['\u03D6', {mathvariant: TexConstant.Variant.NORMAL}],
  upvarrho:       ['\u03F1', {mathvariant: TexConstant.Variant.NORMAL}],
  upvarsigma:     ['\u03C2', {mathvariant: TexConstant.Variant.NORMAL}],
  upvarphi:       ['\u03C6', {mathvariant: TexConstant.Variant.NORMAL}],

  Upgamma:        ['\u0393', {mathvariant: TexConstant.Variant.NORMAL}],
  Updelta:        ['\u0394', {mathvariant: TexConstant.Variant.NORMAL}],
  Uptheta:        ['\u0398', {mathvariant: TexConstant.Variant.NORMAL}],
  Uplambda:       ['\u039B', {mathvariant: TexConstant.Variant.NORMAL}],
  Upxi:           ['\u039E', {mathvariant: TexConstant.Variant.NORMAL}],
  Uppi:           ['\u03A0', {mathvariant: TexConstant.Variant.NORMAL}],
  Upsigma:        ['\u03A3', {mathvariant: TexConstant.Variant.NORMAL}],
  Upupsilon:      ['\u03A5', {mathvariant: TexConstant.Variant.NORMAL}],
  Upphi:          ['\u03A6', {mathvariant: TexConstant.Variant.NORMAL}],
  Uppsi:          ['\u03A8', {mathvariant: TexConstant.Variant.NORMAL}],
  Upomega:        ['\u03A9', {mathvariant: TexConstant.Variant.NORMAL}]
});


export const UpgreekConfiguration = Configuration.create(
  'upgreek', {
    handler: {macro: ['upgreek']},
  }
);

