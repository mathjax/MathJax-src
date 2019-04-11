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
 * @fileoverview    Configuration file for the require package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration, ConfigurationHandler} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import {TeX} from '../../tex.js';

import {Package} from '../../../components/package.js';
import {Loader, CONFIG as LOADERCONFIG} from '../../../components/loader.js';
import {MathJax as mathjax} from '../../../mathjax.js';
import {userOptions, OptionList} from '../../../util/Options.js';

/**
 * Initialize the path to TeX extensions, if it isn't set
 */
if (!LOADERCONFIG.paths.tex) {
    LOADERCONFIG.paths.tex = '[mathjax]/input/tex/extensions';
}

/**
 * The MathJax configuration block (for looking up user-defined package options)
 */
const MJCONFIG = (global.MathJax ? global.MathJax.config || {} : {});

/**
 * Add an extension to the configuration, and configure it's user options
 *
 * @param {TeX} jax       The TeX jax whose configruation is to be modified
 * @param {string} name   The name of the extension being added (e.g., '[tex]/amsCd')
 */
function RegisterExtension(jax: TeX<any, any, any>, name: string) {
    const required = jax.parseOptions.options.required;
    if (required.indexOf(name) < 0) {
        const extension = name.substr(6);
        required.push(name);
        //
        //  Register andy dependencies that were loaded to handle this one
        //
        RegisterDependencies(jax, LOADERCONFIG.dependencies[name]);
        //
        //  If the required file loaded an extension...
        //
        const handler = ConfigurationHandler.get(extension);
        if (handler) {
            //
            //  Register the extension with the jax's configuration
            //
            (jax as any).configuration.register(handler, jax);
            //
            //  Check if ther eare user-supplied options, and set those
            //    (place them in a block for the extension, if needed)
            //
            let options = MJCONFIG[name];
            if (handler.options && options) {
                if (Object.keys(handler.options).length === 1 && handler.options[extension]) {
                    options = {[extension]: options};
                }
                userOptions(jax.parseOptions.options, options);
            }
        }
    }
}

/**
 * Register any dependencies for the loaded extension
 *
 * @param {TeX} jax          The jax whose configuration is being modified
 * @param {string[]} names   The names of the dependencies to register
 */
function RegisterDependencies(jax: TeX<any, any, any>, names: string[] = []) {
    for (const name of names) {
        if (name.substr(0,6) === '[tex]/') {
            RegisterExtension(jax, name);
        }
    }
}

/**
 * Save the jax so that it can be used when \require{} is processed.
 */
function config(config: Configuration, jax: TeX<any, any, any>) {
    jax.parseOptions.options.jax = jax;      // \require needs access to this
    jax.parseOptions.options.required = [];  // stores the names of the packages that have been added
}


/**
 * Namespace for \require methods
 */
export const RequireMethods: Record<string, ParseMethod> = {

    /**
     * Implements \require macro to load TeX extensions
     *
     * @param {TexParser} parser   The current tex parser.
     * @param {string} name        The name of the calling macro.
     */
    Require(parser: TexParser, name: string) {
        const required = parser.GetArgument(name);
        if (required.match(/[^-_a-zA-Z0-9]/) || required === '') {
            throw new TexError('BadPackageName', 'Argument for %1 is not a valid package name', name);
        }
        const extension = '[tex]/' + required;
        if (Package.packages.get(extension)) {
            RegisterExtension(parser.options.jax, extension);
        } else {
            mathjax.retryAfter(Loader.load(extension));
        }
    }

};

/**
 * The command map for the \require macro
 */
new CommandMap('require', {require: 'Require'}, RequireMethods);

/**
 * The configuration for the \require macro
 */
export const RequireConfiguration = Configuration.create(
    'require', {
        handler: {macro: ['require']},
        config: config
    }
);
