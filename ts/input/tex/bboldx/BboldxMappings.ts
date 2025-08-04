/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file Symbol mappings for the bboldx package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { CommandMap, CharacterMap } from '../TokenMap.js';
import { BboldxMethods } from './BboldxMethods.js';

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
new CharacterMap('bboldx-delimiterNormal', BboldxMethods.delimiterNormal, {
  bbLparen: '\u0028',
  bbRparen: '\u0029',
  bbLbrack: '\u005B',
  bbRbrack: '\u005D',
  bbLangle: '\u2329',
  bbRangle: '\u232A',
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
new CharacterMap('bboldx-delimiterBold', BboldxMethods.delimiterBold, {
  bfbbLparen: '\u0028',
  bfbbRparen: '\u0029',
  bfbbLbrack: '\u005B',
  bfbbRbrack: '\u005D',
  bfbbLangle: '\u2329',
  bfbbRangle: '\u232A',
});

new CommandMap('bboldx', {
  mathbb: [
    BboldxMethods.ChooseFont,
    '-bboldx',
    '-bboldx-light',
    '-bboldx-bold',
  ],
  mathbfbb: [
    BboldxMethods.ChooseFont,
    '-bboldx-bold',
    '-bboldx',
    '-bboldx-bold',
  ],
  imathbb: [BboldxMethods.Macro, '\\bbdotlessi'],
  jmathbb: [BboldxMethods.Macro, '\\bbdotlessj'],
  imathbfbb: [BboldxMethods.Macro, '\\bfbbdotlessi'],
  jmathbfbb: [BboldxMethods.Macro, '\\bfbbdotlessj'],
});

// Text Macros.
/**
 * Bb symbols macros for text-bboldx package.
 */
new CharacterMap(
  'text-bboldx-mathchar0miNormal',
  BboldxMethods.mathchar0miNormal,
  {
    // Upper Case Greek
    txtbbGamma: '\u0393',
    txtbbDelta: '\u2206',
    txtbbTheta: '\u0398',
    txtbbLambda: '\u039B',
    txtbbXi: '\u039E',
    txtbbPi: '\u03A0',
    txtbbSigma: '\u03A3',
    txtbbUpsilon: '\u03A5',
    txtbbPhi: '\u03A6',
    txtbbPsi: '\u03A8',
    txtbbOmega: '\u2126',
    // Lower Case Greek
    txtbbalpha: '\u03B1',
    txtbbbeta: '\u03B2',
    txtbbgamma: '\u03B3',
    txtbbdelta: '\u03B4',
    txtbbepsilon: '\u03B5',
    txtbbzeta: '\u03B6',
    txtbbeta: '\u03B7',
    txtbbtheta: '\u03B8',
    txtbbiota: '\u03B9',
    txtbbkappa: '\u03BA',
    txtbblambda: '\u03BB',
    txtbbmu: '\u00B5',
    txtbbnu: '\u03BD',
    txtbbxi: '\u03BE',
    txtbbpi: '\u03C0',
    txtbbrho: '\u03C1',
    txtbbsigma: '\u03C3',
    txtbbtau: '\u03C4',
    txtbbupsilon: '\u03C5',
    txtbbphi: '\u03C6',
    txtbbchi: '\u03C7',
    txtbbpsi: '\u03C8',
    txtbbomega: '\u03C9',
    txtbbdotlessi: '\u0131',
    txtbbdotlessj: '\u0237',
  }
);

/**
 * Macros for delimiters.
 */
new CharacterMap('text-bboldx-delimiterNormal', BboldxMethods.delimiterNormal, {
  txtbbLparen: '\u0028',
  txtbbRparen: '\u0029',
  txtbbLbrack: '\u005B',
  txtbbRbrack: '\u005D',
  txtbbLangle: '\u2329',
  txtbbRangle: '\u232A',
});

/**
 * Bb symbols macros for text-bboldx package.
 */
new CharacterMap('text-bboldx-mathchar0miBold', BboldxMethods.mathchar0miBold, {
  // Upper Case Greek
  txtbfbbGamma: '\u0393',
  txtbfbbDelta: '\u2206',
  txtbfbbTheta: '\u0398',
  txtbfbbLambda: '\u039B',
  txtbfbbXi: '\u039E',
  txtbfbbPi: '\u03A0',
  txtbfbbSigma: '\u03A3',
  txtbfbbUpsilon: '\u03A5',
  txtbfbbPhi: '\u03A6',
  txtbfbbPsi: '\u03A8',
  txtbfbbOmega: '\u2126',
  // Lower Case Greek
  txtbfbbalpha: '\u03B1',
  txtbfbbbeta: '\u03B2',
  txtbfbbgamma: '\u03B3',
  txtbfbbdelta: '\u03B4',
  txtbfbbepsilon: '\u03B5',
  txtbfbbzeta: '\u03B6',
  txtbfbbeta: '\u03B7',
  txtbfbbtheta: '\u03B8',
  txtbfbbiota: '\u03B9',
  txtbfbbkappa: '\u03BA',
  txtbfbblambda: '\u03BB',
  txtbfbbmu: '\u00B5',
  txtbfbbnu: '\u03BD',
  txtbfbbxi: '\u03BE',
  txtbfbbpi: '\u03C0',
  txtbfbbrho: '\u03C1',
  txtbfbbsigma: '\u03C3',
  txtbfbbtau: '\u03C4',
  txtbfbbupsilon: '\u03C5',
  txtbfbbphi: '\u03C6',
  txtbfbbchi: '\u03C7',
  txtbfbbpsi: '\u03C8',
  txtbfbbomega: '\u03C9',
  txtbfbbdotlessi: '\u0131',
  txtbfbbdotlessj: '\u0237',
});

/**
 * Macros for delimiters.
 */
new CharacterMap('text-bboldx-delimiterBold', BboldxMethods.delimiterBold, {
  txtbfbbLparen: '\u0028',
  txtbfbbRparen: '\u0029',
  txtbfbbLbrack: '\u005B',
  txtbfbbRbrack: '\u005D',
  txtbfbbLangle: '\u2329',
  txtbfbbRangle: '\u232A',
});

new CommandMap('text-bboldx', {
  textbb: [
    BboldxMethods.ChooseTextFont,
    '-bboldx',
    '-bboldx-light',
    '-bboldx-bold',
  ],
  textbfbb: [
    BboldxMethods.ChooseTextFont,
    '-bboldx-bold',
    '-bboldx',
    '-bboldx-bold',
  ],
  itextbb: [BboldxMethods.Macro, '\\txtbbdotlessi'],
  jtextbb: [BboldxMethods.Macro, '\\txtbbdotlessj'],
  itextbfbb: [BboldxMethods.Macro, '\\txtbfbbdotlessi'],
  jtextbfbb: [BboldxMethods.Macro, '\\txtbfbbdotlessj'],
});
