/*************************************************************
 *
 *  Copyright (c) 2021-2025 The MathJax Consortium
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
 * @file Configuration file for the gensymb package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { Token } from '../Token.js';
import { TexConstant } from '../TexConstants.js';
import { CharacterMap } from '../TokenMap.js';
import TexParser from '../TexParser.js';

/**
 * Handle characters that are known units.
 *
 * @param {TexParser} parser The current tex parser.
 * @param {Token} mchar The parsed token.
 */
function mathcharUnit(parser: TexParser, mchar: Token) {
  const def = mchar.attributes || {};
  def.mathvariant = TexConstant.Variant.NORMAL;
  def.class = 'MathML-Unit';
  const node = parser.create('token', 'mi', def, mchar.char);
  parser.Push(node);
}

/**
 * gensymb units.
 */
new CharacterMap('gensymb-symbols', mathcharUnit, {
  ohm: '\u2126',
  degree: '\u00B0',
  celsius: '\u2103',
  perthousand: '\u2030',
  micro: '\u00B5',
});

export const GensymbConfiguration = Configuration.create('gensymb', {
  [ConfigurationType.HANDLER]: { [HandlerType.MACRO]: ['gensymb-symbols'] },
});
