/*************************************************************
 *
 *  Copyright (c) 2026-2026 The MathJax Consortium
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
 * @file Configuration file for the v3-compatible font size macros (\large, etc.)
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { CommandMap } from '../TokenMap.js';
import { Configuration } from '../Configuration.js';
import BaseMethods from '../base/BaseMethods.js';

new CommandMap('fontsizev3-macros', {
  tiny: [BaseMethods.SetSize, 0.5], //      // should have been .6
  Tiny: [BaseMethods.SetSize, 0.6], //      // should have been .5
  scriptsize: [BaseMethods.SetSize, 0.7],
  small: [BaseMethods.SetSize, 0.85], //    // should have been .9
  normalsize: [BaseMethods.SetSize, 1.0],
  large: [BaseMethods.SetSize, 1.2], //     // should have been 1.095
  Large: [BaseMethods.SetSize, 1.44], //    // should have been 1.2
  LARGE: [BaseMethods.SetSize, 1.73], //    // should have been 1.44
  huge: [BaseMethods.SetSize, 2.07], //     // should have been 1.728
  Huge: [BaseMethods.SetSize, 2.49], //     // should have been 2.074
});

export const FontSizeV3Configuration = Configuration.create('fontsizev3', {
  [ConfigurationType.HANDLER]: { [HandlerType.MACRO]: ['fontsizev3-macros'] },
});
