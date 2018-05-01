/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview AMS symbols for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import *  as sm from './SymbolMap.js';
import {TexConstant} from './TexConstants.js';
import {TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import BaseMethods from './BaseMethods.js';
import {ParseMethods} from './ParseMethods.js';
import MapHandler from './MapHandler.js';


export namespace AmsSymbols {

  new sm.CharacterMap('AMSsymbols-mathchar0mi', BaseMethods.mathchar0mi, {
      // Lowercase Greek letters
      digamma:                '\u03DD',
      varkappa:               '\u03F0',
      
      // Uppercase Greek letters
      varGamma:               ['\u0393', {mathvariant: TexConstant.Variant.ITALIC}],
      varDelta:               ['\u0394', {mathvariant: TexConstant.Variant.ITALIC}],
      varTheta:               ['\u0398', {mathvariant: TexConstant.Variant.ITALIC}],
      varLambda:              ['\u039B', {mathvariant: TexConstant.Variant.ITALIC}],
      varXi:                  ['\u039E', {mathvariant: TexConstant.Variant.ITALIC}],
      varPi:                  ['\u03A0', {mathvariant: TexConstant.Variant.ITALIC}],
      varSigma:               ['\u03A3', {mathvariant: TexConstant.Variant.ITALIC}],
      varUpsilon:             ['\u03A5', {mathvariant: TexConstant.Variant.ITALIC}],
      varPhi:                 ['\u03A6', {mathvariant: TexConstant.Variant.ITALIC}],
      varPsi:                 ['\u03A8', {mathvariant: TexConstant.Variant.ITALIC}],
      varOmega:               ['\u03A9', {mathvariant: TexConstant.Variant.ITALIC}],

      // Hebrew letters
      beth:                   '\u2136',
      gimel:                  '\u2137',
      daleth:                 '\u2138',

      // Miscellaneous symbols
//    hbar:                   '\u0127',  // in TeX/jax.js
      backprime:              ['\u2035', {variantForm: true}],
      hslash:                 '\u210F',
      varnothing:             ['\u2205', {variantForm: true}],
      blacktriangle:          '\u25B4',
      triangledown:           ['\u25BD', {variantForm: true}],
      blacktriangledown:      '\u25BE',
      square:                 '\u25FB',
      Box:                    '\u25FB',
      blacksquare:            '\u25FC',
      lozenge:                '\u25CA',
      Diamond:                '\u25CA',
      blacklozenge:           '\u29EB',
      circledS:               ['\u24C8', {mathvariant: TexConstant.Variant.NORMAL}],
      bigstar:                '\u2605',
//    angle:                  '\u2220',  // in TeX/jax.js
      sphericalangle:         '\u2222',
      measuredangle:          '\u2221',
      nexists:                '\u2204',
      complement:             '\u2201',
      mho:                    '\u2127',
      eth:                    ['\u00F0', {mathvariant: TexConstant.Variant.NORMAL}],
      Finv:                   '\u2132',
      diagup:                 '\u2571',
      Game:                   '\u2141',
      diagdown:               '\u2572',
      Bbbk:                   ['\u006B', {mathvariant: TexConstant.Variant.DOUBLESTRUCK}],
      
      yen:                    '\u00A5',
      circledR:               '\u00AE',
      checkmark:              '\u2713',
      maltese:                '\u2720'
  });

  new sm.CharacterMap('AMSsymbols-mathchar0m0', BaseMethods.mathchar0mo, {
      // Binary operators
      dotplus:                '\u2214',
      ltimes:                 '\u22C9',
      smallsetminus:          '\u2216',
      rtimes:                 '\u22CA',
      Cap:                    '\u22D2',
      doublecap:              '\u22D2',
      leftthreetimes:         '\u22CB',
      Cup:                    '\u22D3',
      doublecup:              '\u22D3',
      rightthreetimes:        '\u22CC',
      barwedge:               '\u22BC',
      curlywedge:             '\u22CF',
      veebar:                 '\u22BB',
      curlyvee:               '\u22CE',
      doublebarwedge:         '\u2A5E',
      boxminus:               '\u229F',
      circleddash:            '\u229D',
      boxtimes:               '\u22A0',
      circledast:             '\u229B',
      boxdot:                 '\u22A1',
      circledcirc:            '\u229A',
      boxplus:                '\u229E',
      centerdot:              ['\u22C5', {variantForm: true}],
      divideontimes:          '\u22C7',
      intercal:               '\u22BA',

      // Binary relations
      leqq:                   '\u2266',
      geqq:                   '\u2267',
      leqslant:               '\u2A7D',
      geqslant:               '\u2A7E',
      eqslantless:            '\u2A95',
      eqslantgtr:             '\u2A96',
      lesssim:                '\u2272',
      gtrsim:                 '\u2273',
      lessapprox:             '\u2A85',
      gtrapprox:              '\u2A86',
      approxeq:               '\u224A',
      lessdot:                '\u22D6',
      gtrdot:                 '\u22D7',
      lll:                    '\u22D8',
      llless:                 '\u22D8',
      ggg:                    '\u22D9',
      gggtr:                  '\u22D9',
      lessgtr:                '\u2276',
      gtrless:                '\u2277',
      lesseqgtr:              '\u22DA',
      gtreqless:              '\u22DB',
      lesseqqgtr:             '\u2A8B',
      gtreqqless:             '\u2A8C',
      doteqdot:               '\u2251',
      Doteq:                  '\u2251',
      eqcirc:                 '\u2256',
      risingdotseq:           '\u2253',
      circeq:                 '\u2257',
      fallingdotseq:          '\u2252',
      triangleq:              '\u225C',
      backsim:                '\u223D',
      thicksim:               ['\u223C', {variantForm: true}],
      backsimeq:              '\u22CD',
      thickapprox:            ['\u2248', {variantForm: true}],
      subseteqq:              '\u2AC5',
      supseteqq:              '\u2AC6',
      Subset:                 '\u22D0',
      Supset:                 '\u22D1',
      sqsubset:               '\u228F',
      sqsupset:               '\u2290',
      preccurlyeq:            '\u227C',
      succcurlyeq:            '\u227D',
      curlyeqprec:            '\u22DE',
      curlyeqsucc:            '\u22DF',
      precsim:                '\u227E',
      succsim:                '\u227F',
      precapprox:             '\u2AB7',
      succapprox:             '\u2AB8',
      vartriangleleft:        '\u22B2',
      lhd:                    '\u22B2',
      vartriangleright:       '\u22B3',
      rhd:                    '\u22B3',
      trianglelefteq:         '\u22B4',
      unlhd:                  '\u22B4',
      trianglerighteq:        '\u22B5',
      unrhd:                  '\u22B5',
      vDash:                  '\u22A8',
      Vdash:                  '\u22A9',
      Vvdash:                 '\u22AA',
      smallsmile:             ['\u2323', {variantForm: true}],
      shortmid:               ['\u2223', {variantForm: true}],
      smallfrown:             ['\u2322', {variantForm: true}],
      shortparallel:          ['\u2225', {variantForm: true}],
      bumpeq:                 '\u224F',
      between:                '\u226C',
      Bumpeq:                 '\u224E',
      pitchfork:              '\u22D4',
      varpropto:              '\u221D',
      backepsilon:            '\u220D',
      blacktriangleleft:      '\u25C2',
      blacktriangleright:     '\u25B8',
      therefore:              '\u2234',
      because:                '\u2235',
      eqsim:                  '\u2242',
      vartriangle:            ['\u25B3', {variantForm: true}],
      Join:                   '\u22C8',

      // Negated relations
      nless:                  '\u226E',
      ngtr:                   '\u226F',
      nleq:                   '\u2270',
      ngeq:                   '\u2271',
      nleqslant:              ['\u2A87', {variantForm: true}],
      ngeqslant:              ['\u2A88', {variantForm: true}],
      nleqq:                  ['\u2270', {variantForm: true}],
      ngeqq:                  ['\u2271', {variantForm: true}],
      lneq:                   '\u2A87',
      gneq:                   '\u2A88',
      lneqq:                  '\u2268',
      gneqq:                  '\u2269',
      lvertneqq:              ['\u2268', {variantForm: true}],
      gvertneqq:              ['\u2269', {variantForm: true}],
      lnsim:                  '\u22E6',
      gnsim:                  '\u22E7',
      lnapprox:               '\u2A89',
      gnapprox:               '\u2A8A',
      nprec:                  '\u2280',
      nsucc:                  '\u2281',
      npreceq:                ['\u22E0', {variantForm: true}],
      nsucceq:                ['\u22E1', {variantForm: true}],
      precneqq:               '\u2AB5',
      succneqq:               '\u2AB6',
      precnsim:               '\u22E8',
      succnsim:               '\u22E9',
      precnapprox:            '\u2AB9',
      succnapprox:            '\u2ABA',
      nsim:                   '\u2241',
      ncong:                  '\u2246',
      nshortmid:              ['\u2224', {variantForm: true}],
      nshortparallel:         ['\u2226', {variantForm: true}],
      nmid:                   '\u2224',
      nparallel:              '\u2226',
      nvdash:                 '\u22AC',
      nvDash:                 '\u22AD',
      nVdash:                 '\u22AE',
      nVDash:                 '\u22AF',
      ntriangleleft:          '\u22EA',
      ntriangleright:         '\u22EB',
      ntrianglelefteq:        '\u22EC',
      ntrianglerighteq:       '\u22ED',
      nsubseteq:              '\u2288',
      nsupseteq:              '\u2289',
      nsubseteqq:             ['\u2288', {variantForm: true}],
      nsupseteqq:             ['\u2289', {variantForm: true}],
      subsetneq:              '\u228A',
      supsetneq:              '\u228B',
      varsubsetneq:           ['\u228A', {variantForm: true}],
      varsupsetneq:           ['\u228B', {variantForm: true}],
      subsetneqq:             '\u2ACB',
      supsetneqq:             '\u2ACC',
      varsubsetneqq:          ['\u2ACB', {variantForm: true}],
      varsupsetneqq:          ['\u2ACC', {variantForm: true}],


      // Arrows
      leftleftarrows:         '\u21C7',
      rightrightarrows:       '\u21C9',
      leftrightarrows:        '\u21C6',
      rightleftarrows:        '\u21C4',
      Lleftarrow:             '\u21DA',
      Rrightarrow:            '\u21DB',
      twoheadleftarrow:       '\u219E',
      twoheadrightarrow:      '\u21A0',
      leftarrowtail:          '\u21A2',
      rightarrowtail:         '\u21A3',
      looparrowleft:          '\u21AB',
      looparrowright:         '\u21AC',
      leftrightharpoons:      '\u21CB',
      rightleftharpoons:      ['\u21CC', {variantForm: true}],
      curvearrowleft:         '\u21B6',
      curvearrowright:        '\u21B7',
      circlearrowleft:        '\u21BA',
      circlearrowright:       '\u21BB',
      Lsh:                    '\u21B0',
      Rsh:                    '\u21B1',
      upuparrows:             '\u21C8',
      downdownarrows:         '\u21CA',
      upharpoonleft:          '\u21BF',
      upharpoonright:         '\u21BE',
      downharpoonleft:        '\u21C3',
      restriction:            '\u21BE',
      multimap:               '\u22B8',
      downharpoonright:       '\u21C2',
      leftrightsquigarrow:    '\u21AD',
      rightsquigarrow:        '\u21DD',
      leadsto:                '\u21DD',
      dashrightarrow:         '\u21E2',
      dashleftarrow:          '\u21E0',

      // Negated arrows
      nleftarrow:             '\u219A',
      nrightarrow:            '\u219B',
      nLeftarrow:             '\u21CD',
      nRightarrow:            '\u21CF',
      nleftrightarrow:        '\u21AE',
      nLeftrightarrow:        '\u21CE'
  });
    
  new sm.DelimiterMap('AMSsymbols-delimiter', BaseMethods.delimiter, {
      // corners
      '\\ulcorner':           '\u231C',
      '\\urcorner':           '\u231D',
      '\\llcorner':           '\u231E',
      '\\lrcorner':           '\u231F'
  });
    
  new sm.CommandMap('AMSsymbols-macros', {
    implies:    ['Macro','\\;\\Longrightarrow\\;'],
    impliedby:  ['Macro','\\;\\Longleftarrow\\;']
  }, ParseMethods as any);

  /**
   * Dummy init function to make sure the mappings are created.
   */
  export function init() {};
}
