/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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
 * @file    Configuration file for the configmacros package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration, ParserConfiguration } from '../Configuration.js';
import { expandable } from '../../../util/Options.js';
import { CommandMap, EnvironmentMap, MacroMap } from '../TokenMap.js';
import ParseMethods from '../ParseMethods.js';
import { Macro } from '../Token.js';
import NewcommandMethods from '../newcommand/NewcommandMethods.js';
import { BeginEnvItem } from '../newcommand/NewcommandItems.js';
import { TeX } from '../../tex.js';

type TEX = TeX<any, any, any>;

/**
 * The name to use for the macros map
 */
const MACROSMAP = 'configmacros-map';

/**
 * The name to use for the character map
 */
const ACTIVEMAP = 'configmacros-active-map';

/**
 * The name to use for the environment map
 */
const ENVIRONMENTMAP = 'configmacros-env-map';

/**
 * Create the command map for the macros
 *
 * @param {Configuration} config   The configuration object for the input jax
 */
function configmacrosInit(config: ParserConfiguration) {
  new MacroMap(ACTIVEMAP, {});
  new CommandMap(MACROSMAP, {});
  new EnvironmentMap(ENVIRONMENTMAP, ParseMethods.environment, {});
  config.append(
    Configuration.local({
      handler: {
        [HandlerType.CHARACTER]: [ACTIVEMAP],
        [HandlerType.MACRO]: [MACROSMAP],
        [HandlerType.ENVIRONMENT]: [ENVIRONMENTMAP],
      },
      priority: 3,
    })
  );
}

/**
 * Create the user-defined macros and environments from their options
 *
 * @param {Configuration} _config  The configuration object for the input jax
 * @param {TeX} jax                The TeX input jax
 */
function configmacrosConfig(_config: ParserConfiguration, jax: TEX) {
  configActives(jax);
  configMacros(jax);
  configEnvironments(jax);
}

/**
 * Common function for defining MacroMap and CommandMap
 *
 * @param {string} name   The name of the option containing the definitions
 * @param {string} map    The name of the handler map to be augmented
 * @param {TEX} jax       The TeX jax being configured
 */
function setMacros(name: string, map: string, jax: TEX) {
  const handler = jax.parseOptions.handlers.retrieve(map) as CommandMap;
  const macros = jax.parseOptions.options[name];
  for (const cs of Object.keys(macros)) {
    const def = typeof macros[cs] === 'string' ? [macros[cs]] : macros[cs];
    const macro = Array.isArray(def[2])
      ? new Macro(
          cs,
          NewcommandMethods.MacroWithTemplate,
          def.slice(0, 2).concat(def[2])
        )
      : new Macro(cs, NewcommandMethods.Macro, def);
    handler.add(cs, macro);
  }
}

/**
 * Create user-defined active characters from the active option
 *
 * @param {TeX} jax   The TeX input jax
 */
function configActives(jax: TEX) {
  setMacros('active', ACTIVEMAP, jax);
}

/**
 * Create user-defined macros from the macros option
 *
 * @param {TeX} jax   The TeX input jax
 */
function configMacros(jax: TEX) {
  setMacros('macros', MACROSMAP, jax);
}

/**
 * Create user-defined environments from the environments option
 *
 * @param {TeX} jax   The TeX input jax
 */
function configEnvironments(jax: TEX) {
  const handler = jax.parseOptions.handlers.retrieve(
    ENVIRONMENTMAP
  ) as EnvironmentMap;
  const environments = jax.parseOptions.options.environments;
  for (const env of Object.keys(environments)) {
    handler.add(
      env,
      new Macro(
        env,
        NewcommandMethods.BeginEnv,
        [true].concat(environments[env])
      )
    );
  }
}

/**
 * The configuration object for configmacros
 */
export const ConfigMacrosConfiguration = Configuration.create('configmacros', {
  [ConfigurationType.INIT]: configmacrosInit,
  [ConfigurationType.CONFIG]: configmacrosConfig,
  [ConfigurationType.ITEMS]: {
    [BeginEnvItem.prototype.kind]: BeginEnvItem,
  },
  [ConfigurationType.OPTIONS]: {
    active: expandable({}),
    macros: expandable({}),
    environments: expandable({}),
  },
});
