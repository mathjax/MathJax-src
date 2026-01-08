/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Implements a startup module that allows dynamically
 *                loaded components to register themselves, and then
 *                creates MathJax methods for typesetting and converting
 *                math based on the registered components.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  MathJax as MJGlobal,
  MathJaxObject as MJObject,
  MathJaxConfig as MJConfig,
  combineWithMathJax,
  combineDefaults,
  GLOBAL as global,
} from './global.js';

import { MathDocument } from '../core/MathDocument.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { Handler } from '../core/Handler.js';
import { InputJax } from '../core/InputJax.js';
import { OutputJax } from '../core/OutputJax.js';
import { CommonOutputJax } from '../output/common.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { PrioritizedList } from '../util/PrioritizedList.js';
import { OptionList, OPTIONS } from '../util/Options.js';
import { context } from '../util/context.js';

import { TeX } from '../input/tex.js';

/**
 * Update the configuration structure to include the startup configuration
 */
/* prettier-ignore */
export interface MathJaxConfig extends MJConfig {
  startup?: {
    input?: string[];        // The names of the input jax to use
    output?: string;         // The name for the output jax to use
    handler?: string;        // The handler to register
    adaptor?: string;        // The name for the DOM adaptor to use
    document?: any;          // The document (or fragment or string) to work in
    elements?: any[];        // The elements to typeset (default is document body)
    typeset?: boolean;       // Perform initial typeset?
    ready?: () => void;      // Function to perform when components are ready
    pageReady?: () => void;  // Function to perform when page is ready
    invalidOption?: 'fatal' | 'warn'; // Do invalid options produce a warning, or throw an error?
    optionError?: (message: string, key: string) => void,  // Function to report invalid options
    loadAllFontFiles: false; // true means force all dynamic font files to load initially
    [name: string]: any;     // Other configuration blocks
  };
}

/**
 * Generic types for the standard MathJax objects
 */
export type MATHDOCUMENT = MathDocument<any, any, any> & {
  menu?: { loadingPromise: Promise<void> };
};
export type HANDLER = Handler<any, any, any>;
export type DOMADAPTOR = DOMAdaptor<any, any, any>;
export type INPUTJAX = InputJax<any, any, any>;
export type OUTPUTJAX = OutputJax<any, any, any>;
/* prettier-ignore */
export type COMMONJAX =
  CommonOutputJax<any, any, any, any, any, any, any, any, any, any, any>;
export type TEX = TeX<any, any, any>;

/**
 * Array of InputJax also with keys using name of jax
 */
export type JAXARRAY = INPUTJAX[] & { [name: string]: INPUTJAX };

/**
 * A function to extend a handler class
 */
export type HandlerExtension = (handler: HANDLER) => HANDLER;

/**
 * Update the MathJax object to inclide the startup information
 */
export interface MathJaxObject extends MJObject {
  config: MathJaxConfig;
  startup: {
    constructors: { [name: string]: any };
    input: JAXARRAY;
    output: OUTPUTJAX;
    handler: HANDLER;
    adaptor: DOMADAPTOR;
    elements: any[];
    document: MATHDOCUMENT;
    promise: Promise<any>;
    registerConstructor(name: string, constructor: any): void;
    useHandler(name: string, force?: boolean): void;
    useAdaptor(name: string, force?: boolean): void;
    useOutput(name: string, force?: boolean): void;
    useInput(name: string, force?: boolean): void;
    extendHandler(extend: HandlerExtension): void;
    toMML(node: MmlNode): string;
    defaultReady(): void;
    defaultPageReady(): Promise<void>;
    defaultOptionError(message: string, key: string): void;
    getComponents(): void;
    makeMethods(): void;
    makeTypesetMethods(): void;
    makeOutputMethods(iname: string, oname: string, input: INPUTJAX): void;
    makeMmlMethods(name: string, input: INPUTJAX): void;
    makeResetMethod(name: string, input: INPUTJAX): void;
    getInputJax(): JAXARRAY;
    getOutputJax(): OUTPUTJAX;
    getAdaptor(): DOMADAPTOR;
    getHandler(): HANDLER;
  };
  [name: string]: any; // Needed for the methods created by the startup module
}

/**
 * The implementation of the startup module
 */
export abstract class Startup {
  /**
   * The array of handler extensions
   */
  static extensions = new PrioritizedList<HandlerExtension>();

  static visitor: any; // the visitor for toMML();
  static mathjax: any; // the mathjax variable from mathjax.js

  /**
   * The constructors (or other data) registered by the loaded packages
   */
  public static constructors: { [name: string]: any } = {};

  /**
   * The array of InputJax instances (created after everything is loaded)
   */
  public static input: JAXARRAY = [] as JAXARRAY;

  /**
   * The OutputJax instance (created after everything is loaded)
   */
  public static output: OUTPUTJAX = null;

  /**
   * The Handler instance (created after everything is loaded)
   */
  public static handler: HANDLER = null;

  /**
   * The DOMAdaptor instance (created after everything is loaded)
   */
  public static adaptor: DOMADAPTOR = null;

  /**
   * The elements to process (set when typeset or conversion method is called)
   */
  public static elements: any[] = null;

  /**
   * The MathDocument instance being used (based on the browser DOM or configuration value)
   */
  public static document: MATHDOCUMENT = null;

  /**
   * The function that resolves the first promise defined below
   *   (called in the defaultReady() function when MathJax is finished with
   *    its initial typesetting)
   */
  public static promiseResolve: (value?: any) => any;
  /**
   * The function that rejects the first promise defined below
   *   (called in the defaultReady() function when MathJax's initial
   *    typesetting fails)
   */
  public static promiseReject: (reason: any) => void;

  /**
   * The promise for the startup process (the initial typesetting).
   * It is resolved or rejected in the ready() function.
   */
  public static promise = new Promise<any>((resolve, reject) => {
    Startup.promiseResolve = resolve;
    Startup.promiseReject = reject;
  });

  /**
   * A promise that is resolved when the page contents are available
   * for processing.
   */
  public static pagePromise = new Promise<void>((resolve, _reject) => {
    const doc = global.document;
    if (
      !doc ||
      !doc.readyState ||
      doc.readyState === 'complete' ||
      doc.readyState === 'interactive'
    ) {
      resolve();
    } else {
      const listener = () => resolve();
      doc.defaultView.addEventListener('load', listener, true);
      doc.defaultView.addEventListener('DOMContentLoaded', listener, true);
    }
  });

  /**
   * This is true when MathJax.typeset() or MathJax.typesetPromise() have been called
   * (used by the menu code to tell if a rerender action is needed when a component is
   * loaded dynamically).
   */
  public static hasTypeset: boolean = false;

  /**
   * @param {MmlNode} node   The root of the tree to convert to serialized MathML
   * @returns {string}        The serialized MathML from the tree
   */
  public static toMML(node: MmlNode): string {
    return Startup.visitor.visitTree(node, this.document);
  }

  /**
   * @param {string} name      The identifier for the constructor
   * @param {any} constructor  The constructor function for the named object
   */
  public static registerConstructor(name: string, constructor: any) {
    Startup.constructors[name] = constructor;
  }

  /**
   * @param {string} name      The identifier for the Handler to use
   * @param {boolean} force    True to force the Handler to be used even if one is already registered
   */
  public static useHandler(name: string, force: boolean = false) {
    if (!CONFIG.handler || force) {
      CONFIG.handler = name;
    }
  }

  /**
   * @param {string} name      The identifier for the DOMAdaptor to use
   * @param {boolean} force    True to force the DOMAdaptor to be used even if one is already registered
   */
  public static useAdaptor(name: string, force: boolean = false) {
    if (!CONFIG.adaptor || force) {
      CONFIG.adaptor = name;
    }
  }

  /**
   * @param {string} name      The identifier for the InputJax to use
   * @param {boolean} force    True to force the InputJax to be used even if the configuration already
   *                             included an array of input jax
   */
  public static useInput(name: string, force: boolean = false) {
    if (!inputSpecified || force) {
      CONFIG.input.push(name);
    }
  }

  /**
   * @param {string} name      The identifier for the OutputJax to use
   * @param {boolean} force    True to force the OutputJax to be used even if one is already registered
   */
  public static useOutput(name: string, force: boolean = false) {
    if (!CONFIG.output || force) {
      CONFIG.output = name;
    }
  }

  /**
   * @param {HandlerExtension} extend    A function to extend the handler class
   * @param {number} priority            The priority of the extension
   */
  public static extendHandler(extend: HandlerExtension, priority: number = 10) {
    Startup.extensions.add(extend, priority);
  }

  /**
   * The default ready() function called when all the packages have been loaded,
   * which creates the various objects needed by MathJax, creates the methods
   * based on the loaded components, and does the initial typesetting.
   *
   * Setting MathJax.startup.ready in the configuration will
   * override this, but you can call MathJax.startup.defaultReady()
   * within your own ready function if needed, or can use the
   * individual methods below to perform portions of the default
   * startup actions.
   */
  public static defaultReady() {
    Startup.getComponents();
    Startup.makeMethods();
    Startup.pagePromise
      .then(() => CONFIG.pageReady()) // usually the initial typesetting call
      .then(() => Startup.promiseResolve())
      .catch((err) => Startup.promiseReject(err));
  }

  /**
   * The default pageReady() function called when the page is ready to be processed,
   * which returns a promise that does any initial font loading, plus the initial
   * typesetting, if needed.
   *
   * Setting Mathjax.startup.pageReady in the configuration will override this.
   *
   * @returns {Promise<void>} Promise resolving when page is ready to process.
   */
  public static defaultPageReady(): Promise<void> {
    return (
      CONFIG.loadAllFontFiles && (Startup.output as COMMONJAX).font
        ? (Startup.output as COMMONJAX).font.loadDynamicFiles()
        : Promise.resolve()
    )
      .then(() => Startup.document.menu?.loadingPromise)
      .then(
        CONFIG.typeset && MathJax.typesetPromise
          ? () => Startup.typesetPromise(CONFIG.elements)
          : Promise.resolve()
      )
      .then(() => Startup.promiseResolve());
  }

  /**
   * The default OptionError function
   */
  public static defaultOptionError = OPTIONS.optionError;

  /**
   * Perform the typesetting with handling of retries
   *
   * @param {any[]} elements The list of elements to typeset
   * @returns {Promise<any>} The promise that resolves when elements are typeset
   */
  public static typesetPromise(elements: any[]): Promise<any> {
    this.hasTypeset = true;
    return Startup.document.whenReady(async () => {
      Startup.document.options.elements = elements;
      Startup.document.reset();
      await Startup.document.renderPromise();
    });
  }

  /**
   * Create the instances of the registered components
   */
  public static getComponents() {
    Startup.visitor =
      new MathJax._.core.MmlTree.SerializedMmlVisitor.SerializedMmlVisitor();
    Startup.mathjax = MathJax._.mathjax.mathjax;
    Startup.input = Startup.getInputJax();
    Startup.output = Startup.getOutputJax();
    Startup.adaptor = Startup.getAdaptor();
    if (Startup.handler) {
      Startup.mathjax.handlers.unregister(Startup.handler);
    }
    Startup.handler = Startup.getHandler();
    if (Startup.handler) {
      Startup.mathjax.handlers.register(Startup.handler);
      Startup.document = Startup.getDocument();
    }
  }

  /**
   * Make the typeset and conversion methods based on the registered components
   *
   * If there are both input and output jax,
   *   Make Typeset() and TypesetPromise() methods using the given jax,
   *    and TypesetClear() to clear the existing math items
   * For each input jax
   *   Make input2mml() and input2mmlPromise() conversion methods and inputReset() method
   *   If there is a registered output jax
   *     Make input2output() and input2outputPromise conversion methods and outputStylesheet() method
   * Create the MathJax.done() method.
   * Create the MathJax.whenReady() method.
   */
  public static makeMethods() {
    if (Startup.input && Startup.output) {
      Startup.makeTypesetMethods();
    }
    const oname = Startup.output ? Startup.output.name.toLowerCase() : '';
    for (const jax of Startup.input) {
      const iname = jax.name.toLowerCase();
      Startup.makeMmlMethods(iname, jax);
      Startup.makeResetMethod(iname, jax);
      if (Startup.output) {
        Startup.makeOutputMethods(iname, oname, jax);
      }
    }
    MathJax.done = () => Startup.document.done();
    MathJax.whenReady = (action: () => any) =>
      Startup.document.whenReady(action);
  }

  /**
   * Create the Typeset(elements?), TypesetPromise(elements?), and TypesetClear() methods.
   *
   * The first two call the document's render() function, the latter
   *   wrapped in handleRetriesFor() and returning the resulting promise.
   *
   * TypeseClear() clears all the MathItems from the document.
   */
  public static makeTypesetMethods() {
    MathJax.typeset = (elements: any[] = null) => {
      this.hasTypeset = true;
      Startup.document.options.elements = elements;
      Startup.document.reset();
      Startup.document.render();
    };
    MathJax.typesetPromise = (elements: any[] = null) => {
      return Startup.typesetPromise(elements);
    };
    MathJax.typesetClear = (elements: any[] = null) => {
      if (elements) {
        Startup.document.clearMathItemsWithin(elements);
      } else {
        Startup.document.clear();
      }
    };
  }

  /**
   * Make the input2output(math, options?) and input2outputPromise(math, options?) methods,
   *   and outputStylesheet() method, where "input" and "output" are replaced by the
   *   jax names (e.g., tex2chtml() and chtmlStyleSheet()).
   *
   * The first two perform the document's convert() call, with the Promise version wrapped in
   *   handlerRetriesFor() and returning the resulting promise.  The return value is the
   *   DOM object for the converted math.  Use MathJax.startup.adaptor.outerHTML(result)
   *   to get the serialized string version of the output.
   *
   * The outputStylesheet() method returns the styleSheet object for the output.
   * Use MathJax.startup.adaptor.innerHTML(MathJax.outputStylesheet()) to get the serialized
   *   version of the stylesheet.
   * The getMetricsFor(node, display) method returns the metric data for the given node
   *
   * @param {string} iname     The name of the input jax
   * @param {string} oname     The name of the output jax
   * @param {INPUTJAX} input   The input jax instance
   */
  public static makeOutputMethods(
    iname: string,
    oname: string,
    input: INPUTJAX
  ) {
    const name = iname + '2' + oname;
    MathJax[name] = (math: string, options: OptionList = {}) => {
      options = { ...options, format: input.name };
      return Startup.document.convert(math, options);
    };
    MathJax[name + 'Promise'] = (math: string, options: OptionList = {}) => {
      options = { ...options, format: input.name };
      return Startup.document.convertPromise(math, options);
    };
    MathJax[oname + 'Stylesheet'] = () =>
      Startup.output.styleSheet(Startup.document);
    if ('getMetricsFor' in Startup.output) {
      MathJax.getMetricsFor = (node: any, display: boolean) => {
        return (Startup.output as COMMONJAX).getMetricsFor(node, display);
      };
    }
  }

  /**
   * Make the input2mml(math, options?) and input2mmlPromise(math, options?) methods,
   *   where "input" is replaced by the name of the input jax (e.g., "tex2mml").
   *
   * These convert the math to its serialized MathML representation.
   *   The second wraps the conversion in handleRetriesFor() and
   *   returns the resulting promise.
   *
   * @param {string} name     The name of the input jax
   * @param {INPUTJAX} input  The input jax itself
   */
  public static makeMmlMethods(name: string, input: INPUTJAX) {
    const STATE = MathJax._.core.MathItem.STATE;
    MathJax[name + '2mml'] = (math: string, options: OptionList = {}) => {
      options = { ...options, end: STATE.CONVERT, format: input.name };
      return Startup.toMML(Startup.document.convert(math, options));
    };
    MathJax[name + '2mmlPromise'] = async (
      math: string,
      options: OptionList = {}
    ) => {
      options = { ...options, end: STATE.CONVERT, format: input.name };
      const node = await Startup.document.convertPromise(math, options);
      return Startup.toMML(node);
    };
  }

  /**
   * Creates the inputReset() method, where "input" is replaced by the input jax name (e.g., "texReset()).
   *
   * The texReset() method clears the equation numbers and labels
   *
   * @param {string} name     The name of the input jax
   * @param {INPUTJAX} input  The input jax itself
   */
  public static makeResetMethod(name: string, input: INPUTJAX) {
    MathJax[name + 'Reset'] = (...args: any[]) => input.reset(...args);
  }

  /**
   * @returns {JAXARRAY}  The array of instances of the registered input jax
   */
  public static getInputJax(): JAXARRAY {
    const jax = [] as JAXARRAY;
    for (const name of CONFIG.input) {
      const inputClass = Startup.constructors[name];
      if (inputClass) {
        jax[name] = new inputClass(MathJax.config[name]);
        jax.push(jax[name]);
      } else {
        throw Error(
          'Input Jax "' + name + '" is not defined (has it been loaded?)'
        );
      }
    }
    return jax;
  }

  /**
   * @returns {OUTPUTJAX}   The instance of the registered output jax
   */
  public static getOutputJax(): OUTPUTJAX {
    const name = CONFIG.output;
    if (!name) return null;
    const outputClass = Startup.constructors[name];
    if (!outputClass) {
      throw Error(
        'Output Jax "' + name + '" is not defined (has it been loaded?)'
      );
    }
    return new outputClass(MathJax.config[name]);
  }

  /**
   * @returns {DOMADAPTOR}  The instance of the registered DOMAdator (the registered constructor
   *                         in this case is a function that creates the adaptor, not a class)
   */
  public static getAdaptor(): DOMADAPTOR {
    const name = CONFIG.adaptor;
    if (!name || name === 'none') return null;
    const adaptor = Startup.constructors[name];
    if (!adaptor) {
      throw Error(
        'DOMAdaptor "' + name + '" is not defined (has it been loaded?)'
      );
    }
    return adaptor(MathJax.config[name]);
  }

  /**
   * @returns {HANDLER}  The instance of the registered Handler, extended by the registered extensions
   */
  public static getHandler(): HANDLER {
    const name = CONFIG.handler;
    if (!name || name === 'none' || !Startup.adaptor) return null;
    const handlerClass = Startup.constructors[name];
    if (!handlerClass) {
      throw Error(
        'Handler "' + name + '" is not defined (has it been loaded?)'
      );
    }
    let handler = new handlerClass(Startup.adaptor, 5);
    for (const extend of Startup.extensions) {
      handler = extend.item(handler);
    }
    return handler;
  }

  /**
   * Create the document with the given input and output jax
   *
   * @param {any=} root        The Document to use as the root document (or null to use the configured document)
   * @returns {MathDocument}   The MathDocument with the configured input and output jax
   */
  public static getDocument(root: any = null): MathDocument<any, any, any> {
    return Startup.mathjax.document(root || CONFIG.document, {
      ...MathJax.config.options,
      InputJax: Startup.input,
      OutputJax: Startup.output,
    });
  }
}

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = MJGlobal as MathJaxObject;

/*
 * If the startup module hasn't been added to the MathJax variable,
 *   Add the startup configuration and data objects, and
 *   set the method for handling invalid options, if provided.
 */
if (typeof MathJax._.startup === 'undefined') {
  combineDefaults(MathJax.config, 'startup', {
    input: [],
    output: '',
    handler: null,
    adaptor: null,
    document: context.document || '',
    elements: null,
    typeset: true,
    ready: Startup.defaultReady.bind(Startup),
    pageReady: Startup.defaultPageReady.bind(Startup),
    polyfillHasOwn: true, // Can be removed with ES2024 implementation of Object.hasown
  });
  combineWithMathJax({
    startup: Startup,
    options: {},
  });

  if (MathJax.config.startup.invalidOption) {
    OPTIONS.invalidOption = MathJax.config.startup.invalidOption;
  }
  if (MathJax.config.startup.optionError) {
    OPTIONS.optionError = MathJax.config.startup.optionError;
  }
}

/**
 * Export the startup configuration for convenience
 */
export const CONFIG = MathJax.config.startup;

/*
 * Tells if the user configuration included input jax or not
 */
const inputSpecified = CONFIG.input.length !== 0;
