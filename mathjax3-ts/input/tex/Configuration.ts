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


export type HandlerConfig = {[P in HandlerType]?: string[]}
export type FallbackConfig = {[P in HandlerType]?: ParseMethod}
export type StackItemConfig = {[kind: string]: StackItemClass}
export type TagsConfig = {[kind: string]: TagsClass}
export type OptionsConfig = {[key: string]: (string|boolean)}

// export type ConfigurationType = 'handler' | 'fallback' | 'items' | 'tags' | 'options' | 'nodes' | 'preprocessors' | 'postprocessors';


export class Configuration {

  public static create(name: string,
                       config: {handler?: HandlerConfig,
                                fallback?: FallbackConfig,
                                items?: StackItemConfig,
                                tags?: TagsConfig,
                                options?: OptionsConfig,
                                nodes?: {[key: string]: any},
                                preprocessors?: ((input: string) => string)[],
                                postprocessors?: ((input: MmlNode) => void)[]
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
                            )
  }

  // Configuration for the TexParser consist of the following:
  // * Handlerconfigurations
  // * Fallback methods for handler types.
  // * StackItem mappings for the StackFactory.
  // * Tagging objects.
  // * Other Options.

  /**
   * @constructor
   */
  private constructor(readonly name: string,
                      readonly handler: HandlerConfig = {},
                      readonly fallback: FallbackConfig = {},
                      readonly items: StackItemConfig = {},
                      readonly tags: TagsConfig = {},
                      readonly options: OptionsConfig = {},
                      // TODO: Flash this out with a node factory and node type.
                      readonly nodes: {[key: string]: any} = {},
                      public preprocessors: ((input: string) => string)[] = [],
                      public postprocessors: ((input: MmlNode) => void)[] = []
             ) {
    let _default: HandlerConfig = {character: [], delimiter: [], macro: [], environment: []};
    let handlers = Object.keys(handler) as HandlerType[];
    for (const key of handlers) {
      _default[key] = handler[key];
    }
    this.handler = _default;
    ConfigurationHandler.getInstance().set(name, this);
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


