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
 * @file Configuration file for the Html package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { CommandMap } from '../TokenMap.js';
import HtmlMethods from './HtmlMethods.js';

new CommandMap('html_macros', {
  data: HtmlMethods.Data,
  href: HtmlMethods.Href,
  class: HtmlMethods.Class,
  style: HtmlMethods.Style,
  cssId: HtmlMethods.Id,
});

export const HtmlConfiguration = Configuration.create('html', {
  [ConfigurationType.HANDLER]: { [HandlerType.MACRO]: ['html_macros'] },
});
