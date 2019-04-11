/*************************************************************
 *
 *  Copyright (c) 2019 The MathJax Consortium
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
 * @fileoverview    Configuration file for the config-macros package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration, ConfigurationHandler} from '../Configuration.js';
import {expandable} from '../../../util/Options.js';
import {NewcommandConfiguration} from '../newcommand/NewcommandConfiguration.js';
import NewcommandMethods from '../newcommand/NewcommandMethods.js';
import NewcommandUtil from '../newcommand/NewcommandUtil.js';
import {ExtensionMaps} from '../MapHandler.js';
import {TeX} from '../../tex.js';

/**
 * Create the user-defined macros from the macros option
 *
 * @param {Configuration} config   The configuration object for the input jax
 * @param {TeX} jax                The TeX input jax
 */
function configMacrosConfig(config: Configuration, jax: TeX<any, any, any>) {
    const macros = config.options.macros;
    for (const cs of Object.keys(macros)) {
        const parser = {configuration: jax.parseOptions} as any;
        const def = (typeof macros[cs] === 'string' ? [macros[cs]] : macros[cs]);
        Array.isArray(def[2]) ?
            NewcommandUtil.addMacro(parser, cs, NewcommandMethods.MacroWithTemplate, def.slice(0,2).concat(def[2])) :
            NewcommandUtil.addMacro(parser, cs, NewcommandMethods.Macro, def);
    }
}

/**
 * Load the newcommand extension if it hasn't been already
 *
 * @param {Configuration} config   The configuration object for the input jax
 */
function configMacrosInit(config: Configuration) {
    if (config.handler.macro.indexOf(ExtensionMaps.NEW_COMMAND) < 0) {
        config.append(NewcommandConfiguration);
        NewcommandConfiguration.init(config);
    }
}

/**
 * The configuration object for configMacros
 */
export const ConfigMacrosConfiguration = Configuration.create(
    'configMacros', {
        config: configMacrosConfig, configPriority: 10,
        init: configMacrosInit,
        options: {macros: expandable({})}
    }
);
