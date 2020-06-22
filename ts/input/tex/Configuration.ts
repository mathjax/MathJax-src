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
import ParseMethods from './ParseMethods.js';
import {ExtensionMaps, HandlerType} from './MapHandler.js';
import {StackItemClass} from './StackItem.js';
import {TagsClass} from './Tags.js';
import {userOptions, defaultOptions, OptionList} from '../../util/Options.js';
import *  as sm from './SymbolMap.js';
import {SubHandlers} from './MapHandler.js';
import {FunctionList} from '../../util/FunctionList.js';
import {TeX} from '../tex.js';
import {PrioritizedList} from '../../util/PrioritizedList.js';


export type HandlerConfig = {[P in HandlerType]?: string[]};
export type FallbackConfig = {[P in HandlerType]?: ParseMethod};
export type StackItemConfig = {[kind: string]: StackItemClass};
export type TagsConfig = {[kind: string]: TagsClass};
export type Processor<T> = [T, number];
export type ProcessorList = Processor<Function>[];
export type ConfigMethod = (c: ParserConfiguration, j: TeX<any, any, any>) => void;
export type InitMethod = (c: ParserConfiguration) => void;



export class Configuration {


  /**
   * Creates a function priority pair.
   * @param {Function | Processor} func The function or processor.
   * @param {number} priority The default priority.
   * @return {Processor} The processor pair.
   */
  private static makeProcessor<T>(func: T | Processor<T>, priority: number): Processor<T> {
    return Array.isArray(func) ? func : [func, priority];
  }

  /**
   * Creates a configuration for a package.
   * @param {string} name The package name or empty string.
   * @param {Object} config See `create` method.
   * @return {Configuration} The newly generated configuration.
   */
  private static _create(name: string,
                         config: {handler?: HandlerConfig,
                                  fallback?: FallbackConfig,
                                  items?: StackItemConfig,
                                  tags?: TagsConfig,
                                  options?: OptionList,
                                  nodes?: {[key: string]: any},
                                  preprocessors?: (Processor<Function> | Function)[],
                                  postprocessors?: (Processor<Function> | Function)[],
                                  init?: Processor<InitMethod> | InitMethod,
                                  config?: Processor<ConfigMethod> | ConfigMethod,
                                  priority?: number,
                                 } = {}): Configuration {
    let priority = config.priority || 5;
    let init = config.init ? this.makeProcessor(config.init, priority) : null;
    let conf = config.config ? this.makeProcessor(config.config, priority) : null;
    let preprocessors = [];
    if (config.preprocessors) {
      for (const pre of config.preprocessors) {
        preprocessors.push(this.makeProcessor(pre, priority));
      }
    }
    let postprocessors = [];
    if (config.postprocessors) {
      for (const post of config.postprocessors) {
        postprocessors.push(this.makeProcessor(post, priority));
      }
    }
    return new Configuration(
      name,
      config.handler || {},
      config.fallback || {},
      config.items || {},
      config.tags || {},
      config.options || {},
      config.nodes || {},
      preprocessors, postprocessors, init, conf, priority
    );
  }

  /**
   * Creator pattern for creating a named package configuration. This will be
   * administered in the configuration handler and can be retrieved again.
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
   *      string wrt. to given parse options. Can contain a priority.
   *  * _postprocessors_ list of functions for postprocessing the MmlNode
   *      wrt. to given parse options. Can contain a priority.
   *  * _init_ init method and optionally its priority.
   *  * _config_ config method and optionally its priority.
   *  * _priority_ default priority of the configuration.
   * @return {Configuration} The newly generated configuration.
   */
  public static create(name: string,
                       config: {handler?: HandlerConfig,
                                fallback?: FallbackConfig,
                                items?: StackItemConfig,
                                tags?: TagsConfig,
                                options?: OptionList,
                                nodes?: {[key: string]: any},
                                preprocessors?: (Processor<Function> | Function)[],
                                postprocessors?: (Processor<Function> | Function)[],
                                init?: Processor<InitMethod> | InitMethod,
                                config?: Processor<ConfigMethod> | ConfigMethod,
                                priority?: number,
                               } = {}): Configuration {
    let configuration = Configuration._create(name, config);
    ConfigurationHandler.set(name, configuration);
    return configuration;
  }

  /**
   * Creates an unnamed, ephemeral package configuration. It will not added to
   * the configuration handler.
   * @param {Object} config See `create` method.
   * @return {Configuration} The ephemeral package configuration.
   */
  public static temp(config: {handler?: HandlerConfig,
                              fallback?: FallbackConfig,
                              items?: StackItemConfig,
                              tags?: TagsConfig,
                              options?: OptionList,
                              nodes?: {[key: string]: any},
                              preprocessors?: (Processor<Function> | Function)[],
                              postprocessors?: (Processor<Function> | Function)[],
                              init?: Processor<InitMethod> | InitMethod,
                              config?: Processor<ConfigMethod> | ConfigMethod,
                              priority?: number,
                             } = {}): Configuration {
    return Configuration._create('', config);
  }

  /**
   * @return {Configuration} An empty configuration.
   */
  public static empty(): Configuration {
    return this.temp();
  }

  /**
   * @return {Configuration} Initialises and returns an extension configuration.
   */
  public static extension(): Configuration {
    new sm.MacroMap(ExtensionMaps.NEW_MACRO, {}, {});
    new sm.DelimiterMap(ExtensionMaps.NEW_DELIMITER,
                        ParseMethods.delimiter, {});
    new sm.CommandMap(ExtensionMaps.NEW_COMMAND, {}, {});
    new sm.EnvironmentMap(ExtensionMaps.NEW_ENVIRONMENT,
                          ParseMethods.environment, {}, {});
    return this.temp(
      {handler: {character: [],
                 delimiter: [ExtensionMaps.NEW_DELIMITER],
                 macro: [ExtensionMaps.NEW_DELIMITER,
                         ExtensionMaps.NEW_COMMAND,
                         ExtensionMaps.NEW_MACRO],
                 environment: [ExtensionMaps.NEW_ENVIRONMENT]
                }});
  }

  /**
   * @constructor
   */
  private constructor(readonly name: string,
                      readonly handler: HandlerConfig = {},
                      readonly fallback: FallbackConfig = {},
                      readonly items: StackItemConfig = {},
                      readonly tags: TagsConfig = {},
                      readonly options: OptionList = {},
                      readonly nodes: {[key: string]: any} = {},
                      readonly preprocessors: ProcessorList = [],
                      readonly postprocessors: ProcessorList = [],
                      readonly initMethod: Processor<InitMethod> = null,
                      readonly configMethod: Processor<ConfigMethod> = null,
                      public priority: number
                     ) {
    this.handler = Object.assign(
      {character: [], delimiter: [], macro: [], environment: []}, handler);
  }

  /**
   * The init method.
   * @type {Function}
   */
  public get init(): InitMethod {
    return this.initMethod ? this.initMethod[0] : null;
  }

  /**
   * The config method to call once jax is ready.
   * @type {FunctionList}
   */
  public get config(): ConfigMethod {
    return this.configMethod ? this.configMethod[0] : null;
  }

}


export namespace ConfigurationHandler {

  let maps: Map<string, Configuration> = new Map();

  /**
   * Adds a new configuration to the handler overwriting old ones.
   *
   * @param {string} name The name of the configuration.
   * @param {Configuration} map The configuration mapping.
   */
  export let set = function(name: string, map: Configuration): void {
    maps.set(name, map);
  };


  /**
   * Looks up a configuration.
   *
   * @param {string} name The name of the configuration.
   * @return {Configuration} The configuration with the given name or null.
   */
  export let get = function(name: string): Configuration {
    return maps.get(name);
  };

  /**
   * @return {string[]} All configurations in the handler.
   */
  export let keys = function(): IterableIterator<string> {
    return maps.keys();
  };

}


export class ParserConfiguration {

  /**
   * Priority list of init methods.
   * @type {FunctionList}
   */
  protected initMethod: FunctionList = new FunctionList();

  /**
   * Priority list of init methods to call once jax is ready.
   * @type {FunctionList}
   */
  protected configMethod: FunctionList = new FunctionList();

  protected preprocessors: ProcessorList = [];

  protected postprocessors: ProcessorList = [];

  protected configurations: PrioritizedList<Configuration> = new PrioritizedList();

  public handler: HandlerConfig = {character: [], delimiter: [], macro: [], environment: []};
  public fallback: FallbackConfig = {};
  public items: StackItemConfig = {};
  public tags: TagsConfig = {};
  public options: OptionList = {};
  public nodes: {[key: string]: any}  = {};
//  protected 

  /**
   * Initmethod for the configuration;
   *
   * @param {Configuration} configuration   The configuration where this one is being initialized
   */
  public init() {
    this.initMethod.execute(this);
  }

  /**
   * Init method for when the jax is ready
   *
   * @param {Configuration} configuration   The configuration where this one is being initialized
   * @param {TeX} jax                       The TeX jax for this configuration
   */
  public config(jax: TeX<any, any, any>) {
    this.configMethod.execute(this, jax);
    for (const [pre, priority] of this.preprocessors) {
      jax.preFilters.add(pre, priority);
    }
    for (const [post, priority] of this.postprocessors) {
      jax.postFilters.add(post, priority);
    }
  }

  // /**
  //  * Appends configurations to this configuration. Note that fallbacks are
  //  * overwritten, while order of configurations is preserved.
  //  *
  //  * @param {Configuration} configuration A configuration setting for the TeX
  //  *       parser.
  //  */
  // public append(config: Configuration): void {
  //   let handlers = Object.keys(config.handler) as HandlerType[];
  //   for (const key of handlers) {
  //     for (const map of config.handler[key]) {
  //       this.handler[key].unshift(map);
  //     }
  //   }
  //   Object.assign(this.fallback, config.fallback);
  //   Object.assign(this.items, config.items);
  //   Object.assign(this.tags, config.tags);
  //   defaultOptions(this.options, config.options);
  //   Object.assign(this.nodes, config.nodes);
  //   for (let pre of config.preprocessors) {
  //     this.preprocessors.push(pre);
  //   }
  //   for (let post of config.postprocessors) {
  //     this.postprocessors.push(post);
  //   }
  //   if (config.init) {
  //   this.initMethod.add(config.init[0], config.init[0]);
      
  //   }
  //   if (config.config) {
  //     this.configMethod.add(config.config[0], config.config[1]);
  //   }
  // }

  /**
   * Registers a configuration after the input jax is created.  (Used by \require.)
   *
   * @param {Configuration} config   The configuration to be registered in this one
   * @param {TeX} jax                The TeX jax where it is being registered
   * @param {OptionList=} options    The options for the configuration.
   */
  public register(config: Configuration, jax: TeX<any, any, any>, options: OptionList = {}) {
    this.add(config);
    this.init();
    const parser = jax.parseOptions;
    parser.handlers = new SubHandlers(this);
    parser.nodeFactory.setCreators(config.nodes);
    for (const kind of Object.keys(config.items)) {
      parser.itemFactory.setNodeClass(kind, config.items[kind]);
    }
    // defaultOptions(parser.options, config.options);
    userOptions(parser.options, options);
    let conf = config.config;
    if (conf) {
      conf(this, jax);
    }
  }

  public addPackage(pkg: (string | [string, number])) {
    const name = typeof pkg === 'string' ? pkg : pkg[0];
    let conf = ConfigurationHandler.get(name);
    if (conf) {
      this.configurations.add(
        conf, typeof pkg === 'string' ? conf.priority : pkg[1]);
    }
  }

  /**
   * Adds a new Configuration to the existing parser configuration.
   * @param {Configuration} config The new configuration.
   * @param {number} priority It's priority.
   */
  public add(config: Configuration, priority: number = 5) {
    this.append(config, priority);
  }

  public append(config: Configuration, _priority?: number) {
    if (config.initMethod) {
      this.initMethod.add(config.initMethod[0], config.initMethod[1]);
    }
    if (config.configMethod) {
        this.configMethod.add(config.configMethod[0], config.configMethod[1]);
      }
    for (let pre of config.preprocessors) {
      this.preprocessors.push(pre);
    }
    for (let post of config.postprocessors) {
      this.postprocessors.push(post);
    }
    let handlers = Object.keys(config.handler) as HandlerType[];
    for (const key of handlers) {
      for (const map of config.handler[key]) {
        this.handler[key].unshift(map);
      }
    }
    Object.assign(this.fallback, config.fallback);
    Object.assign(this.items, config.items);
    Object.assign(this.tags, config.tags);
    defaultOptions(this.options, config.options);
    Object.assign(this.nodes, config.nodes);
  }

  private combineConfigurations() {
    for (let {item: config, priority: priority} of this.configurations) {
      this.append(config, priority);
    }
  }

  /**
   * @constructor
   */
  constructor(packages: (string | [string, number])[]) {
    packages.forEach(this.addPackage.bind(this));
    // Combine package configurations
    this.combineConfigurations();
  }

}
