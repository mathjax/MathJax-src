/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Configuration options for the TexParser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {ParseMethod} from './Types.js';
import {HandlerType} from './MapHandler.js';
import {StackItemClass} from './StackItem.js';
import {TagsClass} from './Tags.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import ParseOptions from './ParseOptions.js';


export type HandlerConfig = {[P in HandlerType]?: string[]}
export type FallbackConfig = {[P in HandlerType]?: ParseMethod}
export type StackItemConfig = {[kind: string]: StackItemClass}
export type TagsConfig = {[kind: string]: TagsClass}
export type OptionsConfig = {[key: string]: (string|boolean)}


export class Configuration {

  /**
   * Creates a configuration for a package.
   * @param {string} name The package name.
   * @param {Object} config The configuration parameters:
   * Configuration for the TexParser consist of the following:
   *  * _handler_  configuration mapping handler types to lists of symbol mappings.
   *  * _fallback_ configuration mapping handler types to fallback methods.
   *  * _items_ for the StackItem factory.
   *  * _tags_ mapping tagging configurations to tagging objects.
   *  * _options_ parse options for the packages.
   *  * _nodes_ for the Node factory.
   *  * _preprocessors_ list of functions for preprocessing the LaTeX
   *      string wrt. to given parse options.
   *  * _postprocessors_ list of functions for postprocessing the MmlNode
   *      wrt. to given parse options.
   * @return {Configuration} The newly generated configuration.
   */
  public static create(name: string,
                       config: {handler?: HandlerConfig,
                                fallback?: FallbackConfig,
                                items?: StackItemConfig,
                                tags?: TagsConfig,
                                options?: OptionsConfig,
                                nodes?: {[key: string]: any},
                                preprocessors?: ((input: string, options: ParseOptions) => string)[],
                                postprocessors?: ((input: MmlNode, options: ParseOptions) => void)[]
                               }) {
    return new Configuration(name,
                             config.handler || {},
                             config.fallback || {},
                             config.items || {},
                             config.tags || {},
                             config.options || {},
                             config.nodes || {},
                             config.preprocessors || [],
                             config.postprocessors || []
                            );
  }

  /**
   * Appends configurations to this configuration. Note that fallbacks are
   * overwritten.
   *
   * @param {Configuration} configuration A configuration setting for the TeX
   *       parser.
   */
  public append(config: Configuration): void {
    let handlers = Object.keys(config.handler) as HandlerType[];
    for (const key of handlers) {
      for (const map of config.handler[key]) {
        this.handler[key].unshift(map);
      }
    }
    handlers = Object.keys(config.fallback) as HandlerType[];
    Object.assign(this.fallback, config.fallback);
    Object.assign(this.items, config.items);
    Object.assign(this.tags, config.tags);
    Object.assign(this.options, config.options);
    Object.assign(this.nodes, config.nodes);
    this.preprocessors = this.preprocessors.concat(config.preprocessors);
    this.postprocessors = this.postprocessors.concat(config.postprocessors);
  }


  /**
   * @constructor
   */
  private constructor(readonly name: string,
                      readonly handler: HandlerConfig = {},
                      readonly fallback: FallbackConfig = {},
                      readonly items: StackItemConfig = {},
                      readonly tags: TagsConfig = {},
                      readonly options: OptionsConfig = {},
                      readonly nodes: {[key: string]: any} = {},
                      public preprocessors: ((input: string, options: ParseOptions) => string)[] = [],
                      public postprocessors: ((input: MmlNode, options: ParseOptions) => void)[] = []
             ) {
    let _default: HandlerConfig = {character: [], delimiter: [], macro: [], environment: []};
    let handlers = Object.keys(handler) as HandlerType[];
    for (const key of handlers) {
      _default[key] = handler[key];
    }
    this.handler = _default;
    ConfigurationHandler.getInstance().set(name, this);
  }

};


export class ConfigurationHandler {

  private static instance: ConfigurationHandler;

  private map: Map<string, Configuration> = new Map();

  /**
   * @return {ConfigurationHandler} The singleton ConfigurationHandler object.
   */
  public static getInstance(): ConfigurationHandler {
    if (!ConfigurationHandler.instance) {
      ConfigurationHandler.instance = new ConfigurationHandler();
    }
    return ConfigurationHandler.instance;
  }


  /**
   * Adds a new configuration to the handler overwriting old ones.
   *
   * @param {SymbolConfiguration} map Registers a new symbol map.
   */
  public set(name: string, map: Configuration): void {
    this.map.set(name, map);
  }


  /**
   * Looks up a configuration.
   *
   * @param {string} name The name of the configuration.
   * @return {SymbolConfiguration} The configuration with the given name or null.
   */
  public get(name: string): Configuration {
    return this.map.get(name);
  }

  /**
   * @return {string[]} All configurations in the handler.
   */
  public keys(): IterableIterator<string> {
    return this.map.keys();
  }


  /**
   * Dummy constructor
   * @constructor
   */
  private constructor() { }

}


