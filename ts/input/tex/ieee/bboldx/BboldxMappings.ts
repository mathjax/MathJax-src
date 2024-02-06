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

/**
 * The methods that implement the bboldx package.
 */
let BboldxMethods: Record<string, ParseMethod> = {};

BboldxMethods.Macro = BaseMethods.Macro;

function getBbxFont(parser: TexParser, normal: string, light: string, bfbb: string) {
  if (!parser.options?.bboldx) {
    return normal;
  }
  const options = parser.options?.bboldx;
  return options.bfbb ? bfbb : (options.light ? light : normal);
}

BboldxMethods.ChooseFont = function(
  parser: TexParser, name: string,
  normal: string, light: string, bfbb: string) {
  const font = getBbxFont(parser, normal, light, bfbb);
  BaseMethods.MathFont(parser, name, font);
}

/**
 * Handle bboldx symbols as mi in normal variant.
 * @param {TexParser} parser The current tex parser.
 * @param {Token} mchar The parsed token.
 */
BboldxMethods.mathchar0miNormal = function(parser: TexParser, mchar: Token) {
  const font = getBbxFont(parser, '-bboldx', '-bboldx-light', '-bboldx-bold');
  const node = parser.create('token', 'mi', {mathvariant: font}, mchar.char);
  parser.Push(node);
}

/**
 * Handle bboldx delimiters as mi in normal variant.
 * @param {TexParser} parser The current tex parser.
 * @param {Token} delim The parsed token.
 */
BboldxMethods.delimiterNormal = function(parser: TexParser, delim: Token) {
  const font = getBbxFont(parser, '-bboldx', '-bboldx-light', '-bboldx-bold');
  const def = {fence: false, stretchy: false, mathvariant: font};
  const node = parser.create('token', 'mo', def, delim.char);
  parser.Push(node);
}

/**
 * Handle bboldx symbols as mi in bold variant.
 * @param {TexParser} parser The current tex parser.
 * @param {Token} mchar The parsed token.
 */
BboldxMethods.mathchar0miBold = function(parser: TexParser, mchar: Token) {
  const font = getBbxFont(parser, '-bboldx-bold', '-bboldx', '-bboldx-bold');
  const node = parser.create('token', 'mi', {mathvariant: font}, mchar.char);
  parser.Push(node);
}

/**
 * Handle bboldx delimiters as mi in bold variant.
 * @param {TexParser} parser The current tex parser.
 * @param {Token} delim The parsed token.
 */
BboldxMethods.delimiterBold = function(parser: TexParser, delim: Token) {
  const font = getBbxFont(parser, '-bboldx-bold', '-bboldx', '-bboldx-bold');
  const def = {fence: false, stretchy: false, mathvariant: font};
  const node = parser.create('token', 'mo', def, delim.char);
  parser.Push(node);
}

/**
 * Bb symbols macros for bboldx package.
 */
new CharacterMap('bboldx-mathchar0miNormal', BboldxMethods.mathchar0miNormal, {
  // Upper Case Greek
  bbGamma: '\u0393',
  bbDelta: '\u2206',
  bbTheta: '\u0398',
  bbLambda: '\u039B',
  bbXi: '\u039E',
  bbPi: '\u03A0',
  bbSigma: '\u03A3',
  bbUpsilon: '\u03A5',
  bbPhi: '\u03A6',
  bbPsi: '\u03A8',
  bbOmega: '\u2126',
  // Lower Case Greek
  bbalpha: '\u03B1',
  bbbeta: '\u03B2',
  bbgamma: '\u03B3',
  bbdelta: '\u03B4',
  bbepsilon: '\u03B5',
  bbzeta: '\u03B6',
  bbeta: '\u03B7',
  bbtheta: '\u03B8',
  bbiota: '\u03B9',
  bbkappa: '\u03BA',
  bblambda: '\u03BB',
  bbmu: '\u00B5',
  bbnu: '\u03BD',
  bbxi: '\u03BE',
  bbpi: '\u03C0',
  bbrho: '\u03C1',
  bbsigma: '\u03C3',
  bbtau: '\u03C4',
  bbupsilon: '\u03C5',
  bbphi: '\u03C6',
  bbchi: '\u03C7',
  bbpsi: '\u03C8',
  bbomega: '\u03C9',
  bbdotlessi: '\u0131',
  bbdotlessj: '\u0237',
});

/**
 * Macros for delimiters.
 */
new DelimiterMap('bboldx-delimiterNormal', BboldxMethods.delimiterNormal, {
  '\\bbLparen': '\u0028',
  '\\bbRparen': '\u0029',
  '\\bbLbrack': '\u005B',
  '\\bbRbrack': '\u005D',
  '\\bbLangle': '\u2329',
  '\\bbRangle': '\u232A',
});

/**
 * Bb symbols macros for bboldx package.
 */
new CharacterMap('bboldx-mathchar0miBold', BboldxMethods.mathchar0miBold, {
  // Upper Case Greek
  bfbbGamma: '\u0393',
  bfbbDelta: '\u2206',
  bfbbTheta: '\u0398',
  bfbbLambda: '\u039B',
  bfbbXi: '\u039E',
  bfbbPi: '\u03A0',
  bfbbSigma: '\u03A3',
  bfbbUpsilon: '\u03A5',
  bfbbPhi: '\u03A6',
  bfbbPsi: '\u03A8',
  bfbbOmega: '\u2126',
  // Lower Case Greek
  bfbbalpha: '\u03B1',
  bfbbbeta: '\u03B2',
  bfbbgamma: '\u03B3',
  bfbbdelta: '\u03B4',
  bfbbepsilon: '\u03B5',
  bfbbzeta: '\u03B6',
  bfbbeta: '\u03B7',
  bfbbtheta: '\u03B8',
  bfbbiota: '\u03B9',
  bfbbkappa: '\u03BA',
  bfbblambda: '\u03BFBB',
  bfbbmu: '\u00B5',
  bfbbnu: '\u03BD',
  bfbbxi: '\u03BE',
  bfbbpi: '\u03C0',
  bfbbrho: '\u03C1',
  bfbbsigma: '\u03C3',
  bfbbtau: '\u03C4',
  bfbbupsilon: '\u03C5',
  bfbbphi: '\u03C6',
  bfbbchi: '\u03C7',
  bfbbpsi: '\u03C8',
  bfbbomega: '\u03C9',
  bfbbdotlessi: '\u0131',
  bfbbdotlessj: '\u0237',
});

/**
 * Macros for delimiters.
 */
new DelimiterMap('bboldx-delimiterBold', BboldxMethods.delimiterBold, {
  '\\bfbbLparen': '\u0028',
  '\\bfbbRparen': '\u0029',
  '\\bfbbLbrack': '\u005B',
  '\\bfbbRbrack': '\u005D',
  '\\bfbbLangle': '\u2329',
  '\\bfbbRangle': '\u232A',
});

new CommandMap('bboldx', {
  mathbb: ['ChooseFont', '-bboldx', '-bboldx-light', '-bboldx-bold'],
  mathbfbb: ['ChooseFont', '-bboldx-bold', '-bboldx', '-bboldx-bold'],
  imathbb: ['Macro', '\\bbdotlessi'],
  jmathbb: ['Macro', '\\bbdotlessj'],
  imathbfbb: ['Macro', '\\bfbbdotlessi'],
  jmathbfbb: ['Macro', '\\bfbbdotlessj'],
}, BboldxMethods);

