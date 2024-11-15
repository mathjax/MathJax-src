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
 * @file Configuration file for the Newcommand package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration, ParserConfiguration } from '../Configuration.js';
import { BeginEnvItem } from './NewcommandItems.js';
import { NewcommandTables } from './NewcommandUtil.js';
import './NewcommandMappings.js';
import ParseMethods from '../ParseMethods.js';
import * as sm from '../TokenMap.js';

/**
 * Init method for Newcommand package.
 *
 * @param {Configuration} config The current configuration.
 */
const init = function (config: ParserConfiguration) {
  new sm.DelimiterMap(
    NewcommandTables.NEW_DELIMITER,
    ParseMethods.delimiter,
    {}
  );
  new sm.CommandMap(NewcommandTables.NEW_COMMAND, {});
  new sm.EnvironmentMap(
    NewcommandTables.NEW_ENVIRONMENT,
    ParseMethods.environment,
    {}
  );
  config.append(
    Configuration.local({
      [ConfigurationType.HANDLER]: {
        [HandlerType.CHARACTER]: [],
        [HandlerType.DELIMITER]: [NewcommandTables.NEW_DELIMITER],
        [HandlerType.MACRO]: [
          NewcommandTables.NEW_DELIMITER,
          NewcommandTables.NEW_COMMAND,
        ],
        [HandlerType.ENVIRONMENT]: [NewcommandTables.NEW_ENVIRONMENT],
      },
      [ConfigurationType.PRIORITY]: -1,
    })
  );
};

export const NewcommandConfiguration = Configuration.create('newcommand', {
  [ConfigurationType.HANDLER]: {
    macro: ['Newcommand-macros'],
  },
  [ConfigurationType.ITEMS]: {
    [BeginEnvItem.prototype.kind]: BeginEnvItem,
  },
  [ConfigurationType.OPTIONS]: { maxMacros: 1000 },
  [ConfigurationType.INIT]: init,
});
