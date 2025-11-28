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
 * @file Token mappings for the AMScd package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import * as tm from '../TokenMap.js';
import ParseMethods from '../ParseMethods.js';
import AmsCdMethods from './AmsCdMethods.js';

new tm.EnvironmentMap('amscd_environment', ParseMethods.environment, {
  CD: AmsCdMethods.CD,
});

new tm.CommandMap('amscd_macros', {
  minCDarrowwidth: AmsCdMethods.minCDarrowwidth,
  minCDarrowheight: AmsCdMethods.minCDarrowheight,
});

new tm.MacroMap('amscd_special', { '@': AmsCdMethods.arrow });
