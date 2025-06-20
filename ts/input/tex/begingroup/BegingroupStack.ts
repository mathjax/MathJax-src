/*************************************************************
 *
 *  Copyright (c) 2025-2025 The MathJax Consortium
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
 * @file Configuration file for the begingroup package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType } from '../HandlerTypes.js';
import {
  CommandMap,
  EnvironmentMap,
  DelimiterMap,
  TokenMap,
  AbstractParseMap,
} from '../TokenMap.js';
import { Token } from '../Token.js';
import { MapHandler, SubHandlers } from '../MapHandler.js';
import TexError from '../TexError.js';
import {
  NewcommandTables as NT,
  NewcommandPriority,
} from '../newcommand/NewcommandUtil.js';
import ParseMethods from '../ParseMethods.js';
import ParseOptions from '../ParseOptions.js';

type HANDLERTYPE = NT.NEW_DELIMITER | NT.NEW_ENVIRONMENT | NT.NEW_COMMAND;

/**
 * A class for managing the handler maps needed for to hold the
 * definitions for each \begingroup...\endgroup block.
 */
export class BegingroupStack {
  /**
   * The maps to add for each group.
   */
  public static handlerConfig = {
    [HandlerType.DELIMITER]: [NT.NEW_DELIMITER],
    [HandlerType.ENVIRONMENT]: [NT.NEW_ENVIRONMENT],
    [HandlerType.MACRO]: [NT.NEW_DELIMITER, NT.NEW_COMMAND],
  };

  /**
   * Mapping from map name to handler type.
   */
  public static handlerMap = {
    [NT.NEW_DELIMITER]: HandlerType.DELIMITER,
    [NT.NEW_ENVIRONMENT]: HandlerType.ENVIRONMENT,
    [NT.NEW_COMMAND]: HandlerType.MACRO,
  };

  /**
   * The most recently used priority.
   */
  protected i: number = NewcommandPriority;

  /**
   * The priority of the "top" of the stack when the expression began
   * (used to remove groups added during an expression that is restarted
   * by a retry error).
   */
  protected top: number = NewcommandPriority;

  /**
   * The base group's priority (can change to -2 for sandboxed groups).
   */
  protected base: number = NewcommandPriority;

  /**
   * A temporary marker to use when deleting control sequences for
   * global definitions.
   */
  protected MARKER = Symbol('marker') as any;

  /**
   * The handlers for the configuration containing this stack.
   */
  public handlers: SubHandlers;

  /**
   * The maps used for global definitions (the base maps of the stack).
   */
  public global: { [name: string]: TokenMap };

  /**
   * @class
   * @param {ParseOptions} parser  The parse options for the input jax for this stack.
   */
  constructor(parser: ParseOptions) {
    this.handlers = parser.handlers;
    this.getGlobal();
  }

  /**
   * Set the global maps to the current versions of the named maps.
   */
  protected getGlobal() {
    this.global = {
      [NT.NEW_DELIMITER]: MapHandler.getMap(NT.NEW_DELIMITER),
      [NT.NEW_ENVIRONMENT]: MapHandler.getMap(NT.NEW_ENVIRONMENT),
      [NT.NEW_COMMAND]: MapHandler.getMap(NT.NEW_COMMAND),
    };
  }

  /**
   * Removes the given tokens from the specified maps, and
   * returns the global maps for the given names.
   * (Called from NewcommandUtils.checkGlobal() to get the needed
   * global maps when parser.stack.env.isGlobal is set).
   *
   * @param {string[]} tokens      The token to remove from each handler
   * @param {HANDLERTYPE[]} maps   The names of the maps to check
   * @returns {TokenMap[]}         The global maps with the given names
   */
  public checkGlobal(tokens: string[], maps: HANDLERTYPE[]): TokenMap[] {
    for (const name of maps) {
      const token = tokens.shift();
      const handler = this.handlers.get(BegingroupStack.handlerMap[name]);
      //
      // Add a marker to the global map so we know when to stop
      // deleting definitions.  This assumes that the only maps with priority
      // below the NewcommandPriority are created by begingroup.  So other
      // packages should use priorities above NewcommandPriority.
      //
      (this.global[name] as AbstractParseMap<Token>).add(token, this.MARKER);
      //
      // Loop through the definitions deleting them until we reach the
      // marker.  This clears any user-defined definitions of that token.
      //
      let item;
      do {
        const map = handler.applicable(token) as AbstractParseMap<Token>;
        item = map.lookup(token);
        map.remove(token);
      } while (item && item !== this.MARKER);
    }
    //
    // Return the requested global maps.
    //
    return maps.map((name) => this.global[name]);
  }

  /**
   * Push a new set of maps for definitions (i.e., perform a \begingroup)
   */
  public push() {
    new DelimiterMap(NT.NEW_DELIMITER, ParseMethods.delimiter, {});
    new CommandMap(NT.NEW_COMMAND, {});
    new EnvironmentMap(NT.NEW_ENVIRONMENT, ParseMethods.environment, {});
    this.handlers.add(BegingroupStack.handlerConfig, {}, --this.i);
  }

  /**
   * Pop the top set of maps (i.e., perform an \endgroup).
   */
  public pop() {
    if (this.i === this.base) {
      throw new TexError(
        'MissingBegingroup',
        'Missing \\begingroup or extra \\endgroup'
      );
    }
    this.handlers.remove(BegingroupStack.handlerConfig, {});
    //
    // Re-register previous maps, since they all have the same names.
    //
    for (const name of [NT.NEW_COMMAND, NT.NEW_ENVIRONMENT, NT.NEW_DELIMITER]) {
      MapHandler.register(this.handlers.retrieve(name));
    }
    this.i++;
  }

  /**
   * Record the current stack as the top of the stack.
   */
  public finish() {
    this.top = this.i;
  }

  /**
   * Remove groups that are above the top.
   * (Used to restore the stack when an expression is restarted due
   *  to a retry error from loading a dynamic component.)
   */
  public remove() {
    while (this.i < this.top) {
      this.pop();
    }
  }

  /**
   * Reset the stack back to the base (i.e., drop any open groups).
   */
  public reset() {
    this.top = this.base;
    this.remove();
  }

  /**
   * Start sandbox mode: drop any open groups, and push a new one,
   * setting that as the base.  This is intended for use in forums
   * where multiple users can post.  Using this between user posts
   * will prevent definitions made by one user from interfering with
   * other users' posts.  Global definitions that are made before
   * the first \begingroupSandbox call will be available to all
   * isolated sandboxes.  The \begingroupSandbox macro can not be
   * redefined by a user.
   */
  public sandbox() {
    this.base = NewcommandPriority;
    this.reset();
    this.push();
    this.getGlobal();
    this.base = NewcommandPriority - 1;
  }
}

/**
 * @param {ParseOptions} parser   The current TeX parser's parseOptions object.
 * @returns {BegingroupStack}     The begingroup stack for that TeX parser.
 */
export function begingroupStack(parser: ParseOptions): BegingroupStack {
  return parser.packageData.get('begingroup').stack;
}
