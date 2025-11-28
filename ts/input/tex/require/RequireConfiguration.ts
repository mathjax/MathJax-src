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
 * @file    Configuration file for the require package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import {
  Configuration,
  ParserConfiguration,
  ConfigurationHandler,
} from '../Configuration.js';
import TexParser from '../TexParser.js';
import { CommandMap } from '../TokenMap.js';
import { ParseMethod } from '../Types.js';
import TexError from '../TexError.js';
import { TeX } from '../../tex.js';

import { MathJax } from '../../../components/startup.js';
import { Package } from '../../../components/package.js';
import { Loader, CONFIG as LOADERCONFIG } from '../../../components/loader.js';
import { mathjax } from '../../../mathjax.js';
import { expandable } from '../../../util/Options.js';
import { MenuMathDocument } from '../../../ui/menu/MenuHandler.js';

/**
 * The MathJax configuration block (for looking up user-defined package options)
 */
const MJCONFIG = MathJax.config;

/**
 * Load any dependencies for an extension, and add the extension to the input jax.
 *
 * @param {TeX} jax       The TeX jax whose configuration is to be modified
 * @param {string} name   The name of the extension being added (e.g., '[tex]/amscd')
 */
function RegisterExtension(jax: TeX<any, any, any>, name: string) {
  const require = jax.parseOptions.options.require;
  const required = jax.parseOptions.packageData.get('require')
    .required as string[];
  const extension = name.substring(require.prefix.length);
  if (!required.includes(extension)) {
    required.push(extension);
    //
    //  Register any dependencies that were loaded to handle this one,
    //  and save the retry promise, if any, for when the dependencies need
    //  to restart the expression (due to preprocessors, see below).
    //
    const retry = RegisterDependencies(jax, LOADERCONFIG.dependencies[name]);
    //
    // If we need to restart the expression due to the dependencies,
    //   Wait for the dependencies to load, process this extension, then retry,
    // Otherwise, process the extension now.
    //
    if (retry) {
      mathjax.retryAfter(
        retry.then(() => ProcessExtension(jax, name, extension))
      );
    } else {
      ProcessExtension(jax, name, extension);
    }
  }
}

/**
 * Add an extension to the configuration, and configure its user options
 *
 * @param {TeX} jax       The TeX jax whose configuration is to be modified
 * @param {string} name   The name of the extension being added (e.g., '[tex]/amscd')
 * @param {string} extension The name of the configuration handler for the extension.
 */
function ProcessExtension(
  jax: TeX<any, any, any>,
  name: string,
  extension: string
) {
  //
  //  If the required file loaded an extension...
  //
  const handler = ConfigurationHandler.get(extension);
  if (handler) {
    //
    //  Check if there are user-supplied options
    //    (place them in a block for the extension, if needed)
    //
    let options = MJCONFIG[name] || {};
    if (
      handler.options &&
      Object.keys(handler.options).length === 1 &&
      handler.options[extension]
    ) {
      options = { [extension]: options };
    }
    //
    //  Register the extension with the jax's configuration
    //
    (jax as any).configuration.add(extension, jax, options);
    //
    //  If there are preprocessors, restart the typesetting so that they run
    //  (we don't have access to the document or MathItem needed to call
    //   the preprocessors from here)
    //
    const configured = jax.parseOptions.packageData.get('require').configured;
    if (handler.preprocessors.length && !configured.has(extension)) {
      configured.set(extension, true);
      mathjax.retryAfter(Promise.resolve());
    }
  }
}

/**
 * Register any dependencies for the loaded extension
 *
 * @param {TeX} jax          The jax whose configuration is being modified
 * @param {string[]} names   The names of the dependencies to register
 * @returns {Promise<any>}    A promise resolved when all dependency's retries
 *                             are complete (or null if no retries)
 */
function RegisterDependencies(
  jax: TeX<any, any, any>,
  names: string[] = []
): Promise<any> {
  const prefix = jax.parseOptions.options.require.prefix;
  const retries = [];
  for (const name of names) {
    if (name.substring(0, prefix.length) === prefix) {
      try {
        RegisterExtension(jax, name);
      } catch (err) {
        if (!err.retry) throw err;
        retries.push(err.retry);
      }
    }
  }
  return retries.length ? Promise.all(retries) : null;
}

/**
 * Load a required package
 *
 * @param {TexParser} parser   The current tex parser.
 * @param {string} name        The name of the package to load.
 */
export function RequireLoad(parser: TexParser, name: string) {
  const options = parser.options.require;
  const allow = options.allow;
  const extension = (name.substring(0, 1) === '[' ? '' : options.prefix) + name;
  const allowed = Object.hasOwn(allow, extension)
    ? allow[extension]
    : Object.hasOwn(allow, name)
      ? allow[name]
      : options.defaultAllow;
  if (!allowed) {
    throw new TexError(
      'BadRequire',
      'Extension "%1" is not allowed to be loaded',
      extension
    );
  }
  const data = Package.packages.get(extension);
  if (!data) {
    mathjax.retryAfter(Loader.load(extension).catch((_) => {}));
  }
  if (data.hasFailed) {
    throw new TexError('RequireFail', 'Extension "%1" failed to load', name);
  }
  const require = LOADERCONFIG[extension]?.rendererExtensions;
  const menu = (MathJax.startup.document as MenuMathDocument)?.menu;
  if (require && menu) {
    menu.addRequiredExtensions(require);
  }
  RegisterExtension(
    parser.configuration.packageData.get('require').jax,
    extension
  );
}

/**
 * Save the jax so that it can be used when \require{} is processed.
 *
 * @param {ParserConfiguration} _config The parser configuration.
 * @param {TeX} jax The current TeX jax.
 */
function config(_config: ParserConfiguration, jax: TeX<any, any, any>) {
  /* prettier-ignore */
  jax.parseOptions.packageData.set('require', {
    jax: jax,                             // \require needs access to this
    required: [...jax.options.packages],  // stores the names of the packages that have been added
    configured: new Map()                 // stores the packages that have been configured
  });
  const options = jax.parseOptions.options.require;
  const prefix = options.prefix;
  if (prefix.match(/[^_a-zA-Z0-9]/)) {
    throw Error('Illegal characters used in \\require prefix');
  }
  if (!LOADERCONFIG.paths[prefix]) {
    LOADERCONFIG.paths[prefix] = '[mathjax]/input/tex/extensions';
  }
  options.prefix = '[' + prefix + ']/';
}

/**
 * Namespace for \require methods
 */
export const RequireMethods: { [key: string]: ParseMethod } = {
  /**
   * Implements \require macro to load TeX extensions
   *
   * @param {TexParser} parser   The current tex parser.
   * @param {string} name        The name of the calling macro.
   */
  Require(parser: TexParser, name: string) {
    const required = parser.GetArgument(name);
    if (required.match(/[^_a-zA-Z0-9]/) || required === '') {
      throw new TexError(
        'BadPackageName',
        'Argument for %1 is not a valid package name',
        name
      );
    }
    RequireLoad(parser, required);
    parser.Push(parser.itemFactory.create('null'));
  },
};

/**
 * The options for the require extension
 */
export const options = {
  require: {
    //
    // Specifies which extensions can/can't be required.
    // The keys are the names of extensions, and the value is true
    //   if the extension can be required, and false if it can't
    //
    allow: expandable({
      base: false,
      autoload: false,
      configmacros: false,
      tagformat: false,
      setoptions: false,
      texhtml: false,
    }),
    //
    //  The default allow value if the extension isn't in the list above
    //
    defaultAllow: true,
    //
    //  The path prefix to use for exensions:  'tex' means use '[tex]/'
    //  before the extension name.
    //
    prefix: 'tex',
  },
};

/**
 * The command map for the \require macro
 */
new CommandMap('require', { require: RequireMethods.Require });

/**
 * The configuration for the \require macro
 */
export const RequireConfiguration = Configuration.create('require', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.MACRO]: ['require'],
  },
  [ConfigurationType.CONFIG]: config,
  [ConfigurationType.OPTIONS]: options,
});
