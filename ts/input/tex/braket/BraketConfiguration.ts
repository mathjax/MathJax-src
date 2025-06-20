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
 * @file Configuration file for the Braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { BraketItem } from './BraketItems.js';
import './BraketMappings.js';

export const BraketConfiguration = Configuration.create('braket', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.CHARACTER]: ['Braket-characters'],
    [HandlerType.MACRO]: ['Braket-macros'],
  },
  [ConfigurationType.ITEMS]: {
    [BraketItem.prototype.kind]: BraketItem,
  },
  [ConfigurationType.PRIORITY]: 3, // must come before base configuration
});
