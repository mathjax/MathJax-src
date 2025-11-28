/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file Mappings for TeX parsing for Bussproofs package commands.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import BussproofsMethods from './BussproofsMethods.js';
import ParseMethods from '../ParseMethods.js';
import { CommandMap, EnvironmentMap } from '../TokenMap.js';

/**
 * Macros for bussproofs etc.
 */
new CommandMap('Bussproofs-macros', {
  AxiomC: BussproofsMethods.Axiom,
  UnaryInfC: [BussproofsMethods.Inference, 1],
  BinaryInfC: [BussproofsMethods.Inference, 2],
  TrinaryInfC: [BussproofsMethods.Inference, 3],
  QuaternaryInfC: [BussproofsMethods.Inference, 4],
  QuinaryInfC: [BussproofsMethods.Inference, 5],
  RightLabel: [BussproofsMethods.Label, 'right'],
  LeftLabel: [BussproofsMethods.Label, 'left'],
  // Abbreviations are automatically enabled
  AXC: BussproofsMethods.Axiom,
  UIC: [BussproofsMethods.Inference, 1],
  BIC: [BussproofsMethods.Inference, 2],
  TIC: [BussproofsMethods.Inference, 3],
  RL: [BussproofsMethods.Label, 'right'],
  LL: [BussproofsMethods.Label, 'left'],

  noLine: [BussproofsMethods.SetLine, 'none', false],
  singleLine: [BussproofsMethods.SetLine, 'solid', false],
  solidLine: [BussproofsMethods.SetLine, 'solid', false],
  dashedLine: [BussproofsMethods.SetLine, 'dashed', false],
  // Not yet implemented in CSS!
  // doubleLine:       [BussproofsMethods.SetLine, 'double', false],
  // dottedLine:       [BussproofsMethods.SetLine, 'dotted', false],

  alwaysNoLine: [BussproofsMethods.SetLine, 'none', true],
  alwaysSingleLine: [BussproofsMethods.SetLine, 'solid', true],
  alwaysSolidLine: [BussproofsMethods.SetLine, 'solid', true],
  alwaysDashedLine: [BussproofsMethods.SetLine, 'dashed', true],
  // Not yet implemented in CSS!
  // alwaysDoubleLine:       [BussproofsMethods.SetLine, 'double', true],
  // alwaysDottedLine:       [BussproofsMethods.SetLine, 'dotted', true],

  rootAtTop: [BussproofsMethods.RootAtTop, true],
  alwaysRootAtTop: [BussproofsMethods.RootAtTop, true],

  rootAtBottom: [BussproofsMethods.RootAtTop, false],
  alwaysRootAtBottom: [BussproofsMethods.RootAtTop, false],
  // TODO: always commands should be persistent.

  fCenter: BussproofsMethods.FCenter,
  Axiom: BussproofsMethods.AxiomF,
  UnaryInf: [BussproofsMethods.InferenceF, 1],
  BinaryInf: [BussproofsMethods.InferenceF, 2],
  TrinaryInf: [BussproofsMethods.InferenceF, 3],
  QuaternaryInf: [BussproofsMethods.InferenceF, 4],
  QuinaryInf: [BussproofsMethods.InferenceF, 5],
});

new EnvironmentMap('Bussproofs-environments', ParseMethods.environment, {
  prooftree: [BussproofsMethods.Prooftree, null, false],
});
