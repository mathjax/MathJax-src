/*************************************************************
 *
 *  Copyright (c) 2021-2025 The MathJax Consortium
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
 * @file Configuration file for the setoptions package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import {
  Configuration,
  ConfigurationHandler,
  ParserConfiguration,
} from '../Configuration.js';
import { TeX } from '../../tex.js';
import TexParser from '../TexParser.js';
import { CommandMap } from '../TokenMap.js';
import TexError from '../TexError.js';
import { ParseUtil } from '../ParseUtil.js';
import { Macro } from '../Token.js';
import BaseMethods from '../base/BaseMethods.js';
import { expandable, isObject } from '../../../util/Options.js';
import { PrioritizedList } from '../../../util/PrioritizedList.js';

export const SetOptionsUtil = {
  /**
   * Check if options can be set for a given pacakge, and error otherwise.
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} extension   The name of the package whose option is being set.
   * @returns {boolean}          True when options can be set for this package.
   */
  filterPackage(parser: TexParser, extension: string): boolean {
    if (extension !== 'tex' && !ConfigurationHandler.get(extension)) {
      throw new TexError('NotAPackage', 'Not a defined package: %1', extension);
    }
    const config = parser.options.setoptions;
    const options = config.allowOptions[extension];
    if (
      (options === undefined && !config.allowPackageDefault) ||
      options === false
    ) {
      throw new TexError(
        'PackageNotSettable',
        'Options can\'t be set for package "%1"',
        extension
      );
    }
    return true;
  },

  /**
   * Check if an option can be set and error otherwise.
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} extension   The name of the package whose option is being set.
   * @param {string} option      The name of the option being set.
   * @returns {boolean}          True when the option can be set.
   */
  filterOption(parser: TexParser, extension: string, option: string): boolean {
    const config = parser.options.setoptions;
    const options = config.allowOptions[extension] || {};
    const isTex = extension === 'tex';
    const allow =
      Object.hasOwn(options, option) && !isObject(options[option])
        ? options[option]
        : null;
    if (allow === false || (allow === null && !config.allowOptionsDefault)) {
      if (isTex) {
        throw new TexError(
          'TeXOptionNotSettable',
          'Option "%1" is not allowed to be set',
          option
        );
      } else {
        throw new TexError(
          'OptionNotSettable',
          'Option "%1" is not allowed to be set for package %2',
          option,
          extension
        );
      }
    }
    const extOptions = isTex ? parser.options : parser.options[extension];
    if (!extOptions || !Object.hasOwn(extOptions, option)) {
      if (isTex) {
        throw new TexError(
          'InvalidTexOption',
          'Invalid TeX option "%1"',
          option
        );
      } else {
        throw new TexError(
          'InvalidOptionKey',
          'Invalid option "%1" for package "%2"',
          option,
          extension
        );
      }
    }
    return true;
  },

  /**
   * Verify an option's value before setting it.
   *
   * @param {TexParser} _parser            The active tex parser.
   * @param {string} _extension            The name of the package whose option this is.
   * @param {string} _option               The name of the option being set.
   * @param {string} value                 The value to give to the option.
   * @returns {string | boolean | RegExp}  The (possibly modified) value for the option
   */
  filterValue(
    _parser: TexParser,
    _extension: string,
    _option: string,
    value: string
  ): string | boolean | RegExp {
    if (typeof value !== 'string') {
      return value;
    }
    const match = value.match(/^\/(.*)\/([dgimsuvy]*)$/);
    return match ? new RegExp(match[1], match[2]) : value;
  },
};

/**
 * Implements \setOptions[package]{option-values}
 *
 * @param {TexParser} parser   The active tex parser.
 * @param {string} name        The name of the macro being processed.
 */
function SetOptions(parser: TexParser, name: string) {
  const extension = parser.GetBrackets(name) || 'tex';
  const options = ParseUtil.keyvalOptions(parser.GetArgument(name));
  const config = parser.options.setoptions;
  if (!config.filterPackage(parser, extension)) return;
  for (const key of Object.keys(options)) {
    if (config.filterOption(parser, extension, key)) {
      (extension === 'tex' ? parser.options : parser.options[extension])[key] =
        config.filterValue(parser, extension, key, options[key]);
    }
  }
  parser.Push(parser.itemFactory.create('null'));
}

/**
 * If the require package is available, save the original require,
 *   and define a macro that loads the extension and sets
 *   its options, if any.
 *
 * @param {ParserConfiguration} _config The current configuration.
 * @param {TeX} jax                     The active tex input jax.
 */
function setoptionsConfig(
  _config: ParserConfiguration,
  jax: TeX<any, any, any>
) {
  const setOptionsMap = new CommandMap('setoptions', {
    setOptions: SetOptions,
  });
  const macros = jax.parseOptions.handlers.get(HandlerType.MACRO);
  macros.add(['setoptions'], null, PrioritizedList.DEFAULTPRIORITY - 1); // put it in front of the standard maps
  const require = macros.lookup('require') as any;
  if (require) {
    setOptionsMap.add('Require', new Macro('Require', require._func));
    setOptionsMap.add(
      'require',
      new Macro('require', BaseMethods.Macro, [
        '\\Require{#2}\\setOptions[#2]{#1}',
        2,
        '',
      ])
    );
  }
}

export const SetOptionsConfiguration = Configuration.create('setoptions', {
  [ConfigurationType.CONFIG]: setoptionsConfig,
  [ConfigurationType.PRIORITY]: 3, // must be less than the priority of the require package (which is 5).
  /* prettier-ignore */
  [ConfigurationType.OPTIONS]: {
      setoptions: {
        filterPackage: SetOptionsUtil.filterPackage,  // filter for whether a package can be configured
        filterOption: SetOptionsUtil.filterOption,    // filter for whether an option can be set
        filterValue: SetOptionsUtil.filterValue,      // filter for the value to assign to an option
        allowPackageDefault: true,       // default for allowing packages when not explicitly set in allowOptions
        allowOptionsDefault: true,       // default for allowing option that isn't explicitly set in allowOptions
        allowOptions: expandable({       // list of packages to allow/disallow, and their options to allow/disallow
          //
          //  top-level tex items can be set, but not these
          //    (that leaves digits and the tagging options)
          //
          tex: {
            FindTeX: false,
            formatError: false,
            package: false,
            baseURL: false,
            tags: false,
            maxBuffer: false,
            maxMaxros: false,
            macros: false,
            environments: false
          },
          //
          // These packages can't be configured at all
          //
          setoptions: false,
          autoload: false,
          require: false,
          configmacros: false,
          tagformat: false
        })
      }
    },
});
