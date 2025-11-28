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
 * @file Configuration file for the empheq package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { CommandMap, EnvironmentMap } from '../TokenMap.js';
import { ParseUtil } from '../ParseUtil.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import { BeginItem } from '../base/BaseItems.js';
import { EmpheqUtil } from './EmpheqUtil.js';
import ParseMethods from '../ParseMethods.js';

/**
 * The methods that implement the empheq package.
 */
export const EmpheqMethods = {
  /**
   * Handle an empheq environment.
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {BeginItem} begin    The begin item for this environment.
   */
  Empheq(parser: TexParser, begin: BeginItem) {
    if (parser.stack.env.closing === begin.getName()) {
      delete parser.stack.env.closing;
      parser.Push(
        parser.itemFactory
          .create('end')
          .setProperty('name', parser.stack.global.empheq)
      );
      parser.stack.global.empheq = '';
      const empheq = parser.stack.Top() as BeginItem;
      EmpheqUtil.adjustTable(empheq, parser);
      parser.Push(
        parser.itemFactory.create('end').setProperty('name', 'empheq')
      );
    } else {
      ParseUtil.checkEqnEnv(parser);
      const opts = parser.GetBrackets('\\begin{' + begin.getName() + '}') || '';
      const [env, n] = parser
        .GetArgument('\\begin{' + begin.getName() + '}')
        .split(/=/);
      if (!EmpheqUtil.checkEnv(env)) {
        throw new TexError(
          'EmpheqInvalidEnv',
          'Invalid environment "%1" for %2',
          env,
          begin.getName()
        );
      }
      begin.setProperty('nestStart', true);
      if (opts) {
        begin.setProperties(
          EmpheqUtil.splitOptions(opts, { left: 1, right: 1 })
        );
      }
      parser.stack.global.empheq = env;
      parser.string =
        '\\begin{' +
        env +
        '}' +
        (n ? '{' + n + '}' : '') +
        parser.string.slice(parser.i);
      parser.i = 0;
      parser.Push(begin);
    }
  },

  /**
   * Create an <mo> with a given content
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} _name       The name of the macro being processed.
   * @param {string} c           The character for the <mo>
   */
  EmpheqMO(parser: TexParser, _name: string, c: string) {
    parser.Push(parser.create('token', 'mo', {}, c));
  },

  /**
   * Create a delimiter <mo> with a given character
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} name        The name of the macro being processed.
   */
  EmpheqDelim(parser: TexParser, name: string) {
    const c = parser.GetDelimiter(name);
    parser.Push(
      parser.create('token', 'mo', { stretchy: true, symmetric: true }, c)
    );
  },
};

//
//  Define an environment map to add the new empheq environment
//
new EnvironmentMap('empheq-env', ParseMethods.environment, {
  empheq: [EmpheqMethods.Empheq, 'empheq'],
});

//
//  Define the empheq characters
//
new CommandMap('empheq-macros', {
  empheqlbrace: [EmpheqMethods.EmpheqMO, '{'],
  empheqrbrace: [EmpheqMethods.EmpheqMO, '}'],
  empheqlbrack: [EmpheqMethods.EmpheqMO, '['],
  empheqrbrack: [EmpheqMethods.EmpheqMO, ']'],
  empheqlangle: [EmpheqMethods.EmpheqMO, '\u27E8'],
  empheqrangle: [EmpheqMethods.EmpheqMO, '\u27E9'],
  empheqlparen: [EmpheqMethods.EmpheqMO, '('],
  empheqrparen: [EmpheqMethods.EmpheqMO, ')'],
  empheqlvert: [EmpheqMethods.EmpheqMO, '|'],
  empheqrvert: [EmpheqMethods.EmpheqMO, '|'],
  empheqlVert: [EmpheqMethods.EmpheqMO, '\u2016'],
  empheqrVert: [EmpheqMethods.EmpheqMO, '\u2016'],
  empheqlfloor: [EmpheqMethods.EmpheqMO, '\u230A'],
  empheqrfloor: [EmpheqMethods.EmpheqMO, '\u230B'],
  empheqlceil: [EmpheqMethods.EmpheqMO, '\u2308'],
  empheqrceil: [EmpheqMethods.EmpheqMO, '\u2309'],
  empheqbiglbrace: [EmpheqMethods.EmpheqMO, '{'],
  empheqbigrbrace: [EmpheqMethods.EmpheqMO, '}'],
  empheqbiglbrack: [EmpheqMethods.EmpheqMO, '['],
  empheqbigrbrack: [EmpheqMethods.EmpheqMO, ']'],
  empheqbiglangle: [EmpheqMethods.EmpheqMO, '\u27E8'],
  empheqbigrangle: [EmpheqMethods.EmpheqMO, '\u27E9'],
  empheqbiglparen: [EmpheqMethods.EmpheqMO, '('],
  empheqbigrparen: [EmpheqMethods.EmpheqMO, ')'],
  empheqbiglvert: [EmpheqMethods.EmpheqMO, '|'],
  empheqbigrvert: [EmpheqMethods.EmpheqMO, '|'],
  empheqbiglVert: [EmpheqMethods.EmpheqMO, '\u2016'],
  empheqbigrVert: [EmpheqMethods.EmpheqMO, '\u2016'],
  empheqbiglfloor: [EmpheqMethods.EmpheqMO, '\u230A'],
  empheqbigrfloor: [EmpheqMethods.EmpheqMO, '\u230B'],
  empheqbiglceil: [EmpheqMethods.EmpheqMO, '\u2308'],
  empheqbigrceil: [EmpheqMethods.EmpheqMO, '\u2309'],
  empheql: EmpheqMethods.EmpheqDelim,
  empheqr: EmpheqMethods.EmpheqDelim,
  empheqbigl: EmpheqMethods.EmpheqDelim,
  empheqbigr: EmpheqMethods.EmpheqDelim,
});

//
//  Define the package for our new environment
//
export const EmpheqConfiguration = Configuration.create('empheq', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.MACRO]: ['empheq-macros'],
    [HandlerType.ENVIRONMENT]: ['empheq-env'],
  },
});
