/*************************************************************
 *
 *  Copyright (c) 2018-2024 The MathJax Consortium
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
 * @fileoverview Mappings for TeX parsing for definitorial commands.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import NewcommandMethods from './NewcommandMethods.js';
import {CommandMap} from '../TokenMap.js';


/**
 * Macros for newcommand etc.
 */
new CommandMap('Newcommand-macros', {
  newcommand:       NewcommandMethods.NewCommand,
  renewcommand:     NewcommandMethods.NewCommand,
  newenvironment:   NewcommandMethods.NewEnvironment,
  renewenvironment: NewcommandMethods.NewEnvironment,
  def:              NewcommandMethods.MacroDef,
  'let':            NewcommandMethods.Let
});


