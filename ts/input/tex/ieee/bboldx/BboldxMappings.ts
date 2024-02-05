/*************************************************************
 *
 *  Copyright (c) 2017-2024 The MathJax Consortium
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
 * @fileoverview Symbol mappings for the bboldx package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Token} from '../../Token.js';
import {CommandMap, CharacterMap, DelimiterMap} from '../../TokenMap.js';
import BaseMethods from '../../base/BaseMethods.js';
import {ParseMethod} from '../../Types.js';
import TexParser from '../../TexParser.js';
import ParseMethods from '../../ParseMethods.js';

/**
 * The methods that implement the bboldx package.
 */
let BboldxMethods: Record<string, ParseMethod> = {};

BboldxMethods.MathFont = BaseMethods.MathFont;
BboldxMethods.ChooseFont = function (parser: TexParser, name: string) {
  BaseMethods.MathFont(parser, name, parser.options.bboldx.sans ? '-ds-ss' : '-ds-rm');
}

BboldxMethods.mathchar0mi = function(parse: TexParser, mchar: Token) {
  ParseMethods.mathchar0mi(parse, mchar);
}

new CommandMap('bboldx', {
  mathbb: ['MathFont', '-bboldx'],
  mathbfbb: ['MathFont', '-bboldx-bold'],
  // Temporary for testing.
  mathltbb: ['MathFont', '-bboldx-light'],
}, BboldxMethods);

/**
 * Macros for bboldx package.
 */
new CharacterMap('bboldx-mathchar0mi', BboldxMethods.mathchar0mi, {
  // Upper Case Greek
  bbGamma: ['\u0393', {mathvariant: '-bboldx'}],
  bbDelta: ['\u2206', {mathvariant: '-bboldx'}],
  bbTheta: ['\u0398', {mathvariant: '-bboldx'}],
  bbLambda: ['\u039B', {mathvariant: '-bboldx'}],
  bbXi: ['\u039E', {mathvariant: '-bboldx'}],
  bbPi: ['\u03A0', {mathvariant: '-bboldx'}],
  bbSigma: ['\u03A3', {mathvariant: '-bboldx'}],
  bbUpsilon: ['\u03A5', {mathvariant: '-bboldx'}],
  bbPhi: ['\u03A6', {mathvariant: '-bboldx'}],
  bbPsi: ['\u03A8', {mathvariant: '-bboldx'}],
  bbOmega: ['\u2126', {mathvariant: '-bboldx'}],
  // Lower Case Greek
  bbalpha: ['\u03B1', {mathvariant: '-bboldx'}],
  bbbeta: ['\u03B2', {mathvariant: '-bboldx'}],
  bbgamma: ['\u03B3', {mathvariant: '-bboldx'}],
  bbdelta: ['\u03B4', {mathvariant: '-bboldx'}],
  bbepsilon: ['\u03B5', {mathvariant: '-bboldx'}],
  bbzeta: ['\u03B6', {mathvariant: '-bboldx'}],
  bbeta: ['\u03B7', {mathvariant: '-bboldx'}],
  bbtheta: ['\u03B8', {mathvariant: '-bboldx'}],
  bbiota: ['\u03B9', {mathvariant: '-bboldx'}],
  bbkappa: ['\u03BA', {mathvariant: '-bboldx'}],
  bblambda: ['\u03BB', {mathvariant: '-bboldx'}],
  bbmu: ['\u00B5', {mathvariant: '-bboldx'}],
  bbnu: ['\u03BD', {mathvariant: '-bboldx'}],
  bbxi: ['\u03BE', {mathvariant: '-bboldx'}],
  bbpi: ['\u03C0', {mathvariant: '-bboldx'}],
  bbrho: ['\u03C1', {mathvariant: '-bboldx'}],
  bbsigma: ['\u03C3', {mathvariant: '-bboldx'}],
  bbtau: ['\u03C4', {mathvariant: '-bboldx'}],
  bbupsilon: ['\u03C5', {mathvariant: '-bboldx'}],
  bbphi: ['\u03C6', {mathvariant: '-bboldx'}],
  bbchi: ['\u03C7', {mathvariant: '-bboldx'}],
  bbpsi: ['\u03C8', {mathvariant: '-bboldx'}],
  bbomega: ['\u03C9', {mathvariant: '-bboldx'}],
  bbdotlessi: ['\u0131', {mathvariant: '-bboldx'}],
  bbdotlessj: ['\u0237', {mathvariant: '-bboldx'}]
});

/**
 * Macros for delimiters.
 */
new DelimiterMap('bboldx-delimiter', ParseMethods.delimiter, {
  '\\bbLparen':                ['\u0028', {mathvariant: '-bboldx'}],
  '\\bbRparen':                ['\u0029', {mathvariant: '-bboldx'}],
  '\\bbLbrack':                ['\u005B', {mathvariant: '-bboldx'}],
  '\\bbRbrack':                ['\u005D', {mathvariant: '-bboldx'}],
  '\\bbLangle':                ['\u2329', {mathvariant: '-bboldx'}],
  '\\bbRangle':                ['\u232A', {mathvariant: '-bboldx'}],
  // \let\imathbb\bbdotlessi
  // \let\jmathbb\bbdotlessj
});
