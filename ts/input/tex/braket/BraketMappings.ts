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
 * @file Mappings for TeX parsing of the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { CommandMap, MacroMap } from '../TokenMap.js';
import BraketMethods from './BraketMethods.js';

/**
 * Macros for braket package.
 */
new CommandMap('Braket-macros', {
  bra: [BraketMethods.Macro, '{\\langle {#1} \\vert}', 1],
  ket: [BraketMethods.Macro, '{\\vert {#1} \\rangle}', 1],
  braket: [BraketMethods.Braket, '\u27E8', '\u27E9', false, Infinity],
  set: [BraketMethods.Braket, '{', '}', false, 1],
  Bra: [BraketMethods.Macro, '{\\left\\langle {#1} \\right\\vert}', 1],
  Ket: [BraketMethods.Macro, '{\\left\\vert {#1} \\right\\rangle}', 1],
  Braket: [BraketMethods.Braket, '\u27E8', '\u27E9', true, Infinity],
  Set: [BraketMethods.Braket, '{', '}', true, 1, true],
  // Not part of the LaTeX package:
  ketbra: [
    BraketMethods.Macro,
    '{\\vert {#1} \\rangle\\langle {#2} \\vert}',
    2,
  ],
  Ketbra: [
    BraketMethods.Macro,
    '{\\left\\vert {#1} \\right\\rangle\\left\\langle {#2} \\right\\vert}',
    2,
  ],
  // Treatment of bar.
  '|': BraketMethods.Bar,
});

/**
 * Character map for braket package.
 */
new MacroMap('Braket-characters', {
  '|': BraketMethods.Bar,
});
