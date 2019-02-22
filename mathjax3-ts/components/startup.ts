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
 * @fileoverview  Implements a startup module that allows dynamically
 *                loaded components to register themselves, and then
 *                creates MathJax methods for typesetting and converting
 *                math based on the registered components.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathJax as MJGlobal, MathJaxObject as MJObject,
        MathJaxConfig as MJConfig, combineWithMathJax, combineDefaults} from './global.js';

import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {Handler} from '../core/Handler.js';
import {InputJax, AbstractInputJax} from '../core/InputJax.js';
import {OutputJax, AbstractOutputJax} from '../core/OutputJax.js';
import {DOMAdaptor} from '../core/DOMAdaptor.js';
import {PrioritizedList} from '../util/PrioritizedList.js';

import {TeX} from '../input/tex.js';


/**
 * Update the configuration structure to include the startup configuration
 */
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
        [name: string]: any;     // Other configuration blocks
    };
};

/**
 * Generic types for the standard MathJax objects
 */
export type MATHDOCUMENT = MathDocument<any, any, any>;
export type MATHITEM = MathItem<any, any, any>;
export type HANDLER = Handler<any, any, any>;
export type DOMADAPTOR = DOMAdaptor<any, any, any>;
export type INPUTJAX = InputJax<any, any, any>;
export type OUTPUTJAX = OutputJax<any, any, any>;
export type TEX = TeX<any, any, any>;

/**
 * A function to extend a handler class
 */
export type HandlerExtension = (handler: HANDLER) => HANDLER;

/**
 * Functions to be called in typeset and conversion methods created for the registered packages
 */
export type TypesetCall = (document: MATHDOCUMENT) => void;
export type ConvertCall = (math: MATHITEM, document: MATHDOCUMENT) => void;

/**
 * Update the MathJax object to inclide the startup information
 */
export interface MathJaxObject extends MJObject {
    config: MathJaxConfig;
    startup: {
        constructors: {[name: string]: any};
        input: INPUTJAX[];
        output: OUTPUTJAX;
        handler: HANDLER;
        adaptor: DOMADAPTOR;
        elements: any[];
        document: MATHDOCUMENT;
        promise: Promise<void>;
        pagePromise: Promise<void>;
        registerConstructor(name: string, constructor: any): void;
        useHander(name: string, force?: boolean): void;
        useAdaptor(name: string, force?: boolean): void;
        useOutput(name: string, force?: boolean): void;
        useInput(name:string, force?: boolean): void;
        extendHandler(extend: HandlerExtension): void;
        toMML(node: MmlNode): string;
        typesetCall(fn: string | TypesetCall, priority: number): void;
        clearTypesetCalls(): void;
        convertCall(fn: string | ConvertCall, priority: number): void;
        clearConvertCalls(): void;
        defaultReady(): void;
        getComponents(): void;
        makeMethods(): void;
        makeTypesetMethods(): void;
        makeOutputMethods(iname: string, oname: string, input: INPUTJAX): void;
        makeMmlMethods(name: string, input: INPUTJAX): void;
        makeResetMethod(name: string, input: INPUTJAX): void;
        convertMath(mitem: MATHITEM, document: MATHDOCUMENT, maxPriority?: number): void;
        getInputJax(): INPUTJAX[];
        getOutputJax(): OUTPUTJAX;
        getAdaptor(): DOMADAPTOR;
        getHandler(): HANDLER;
    };
    [name: string]: any;    // Needed for the methods created by the startup module
}

/*
 * Access to the browser document
 */
declare var global: {document: Document};

/**
 * The implementation of the startup module
 */
export namespace Startup {

    /**
     * The array of handler extensions
     */
    const extensions: HandlerExtension[] = [];

    /**
     * The prioritized list of functions to call duing typesetting and conversion
     */
    let typesetCalls = new PrioritizedList<TypesetCall>();
    let convertCalls = new PrioritizedList<ConvertCall>();

    let visitor: any;  // the visitor for toMML();
    let mathjax: any;  // variable for the MathJax variable from mathjax.js

    /**
     * The constructors (or other data) registered by the loaded packages
     */
    export const constructors: {[name: string]: any} = {};

    /**
     * The array of InputJax instances (created after everything is loaded)
     */
    export let input: INPUTJAX[] = [];

    /**
     * The OutputJax instance (created after everything is loaded)
     */
    export let output: OUTPUTJAX = null;

    /**
     * The Handler instance (created after everything is loaded)
     */
    export let handler: HANDLER = null;

    /**
     * The DOMAdaptor instance (created after everything is loaded)
     */
    export let adaptor: DOMADAPTOR = null;

    /**
     * The elements to process (set when typeset or conversion method is called)
     */
    export let elements: any[] = null;

    /**
     * The MathDocument instance being used (based on the browser DOM or configuration value)
     */
    export let document: MATHDOCUMENT = null;

    /**
     * The promise for the default typesetting, if one is performed
     */
    export let promise: Promise<void> = null;

    /**
     * A promise that is resolved when the page is loaded and ready to be processed
     */
    export let pagePromise: Promise<void> = new Promise<void>((resolve, reject) => {
        const doc = global.document;
        if (!doc || !doc.readyState || doc.readyState === 'complete' || doc.readyState === 'interactive') {
            resolve();
        } else {
            const listener = () => resolve();
            doc.defaultView.addEventListener('load', listener, true);
            doc.defaultView.addEventListener('DOMContentLoaded', listener, true);
        }
    });

    /**
     * @param {MmlNode} node   The root of the tree to convert to serialized MathML
     * @return {string}        The serialized MathML from the tree
     */
    export function toMML(node: MmlNode) {
        return visitor.visitTree(node, document);
    };

    /**
     * @param {string} name      The identifier for the constructor
     * @param {any} constructor  The constructor function for the named object
     */
    export function registerConstructor(name: string, constructor: any) {
        constructors[name] = constructor;
    };

    /**
     * @param {string} name      The identifier for the Handler to use
     * @param {boolean} force    True to force the Handler to be used even if one is already registered
     */
    export function useHandler(name: string, force: boolean = false) {
        if (!CONFIG.handler || force) {
            CONFIG.handler = name;
        }
    };

    /**
     * @param {string} name      The identifier for the DOMAdaptor to use
     * @param {boolean} force    True to force the DOMAdaptor to be used even if one is already registered
     */
    export function useAdaptor(name: string, force: boolean = false) {
        if (!CONFIG.adaptor || force) {
            CONFIG.adaptor = name;
        }
    };

    /**
     * @param {string} name      The identifier for the InputJax to use
     * @param {boolean} force    True to force the InputJax to be used even if the configuration already
     *                             included an array of input jax
     */
    export function useInput(name: string, force: boolean = false) {
        if (!inputSpecified || force) {
            CONFIG.input.push(name);
        }
    };

    /**
     * @param {string} name      The identifier for the OutputJax to use
     * @param {boolean} force    True to force the OutputJax to be used even if one is already registered
     */
    export function useOutput(name: string, force: boolean = false) {
        if (!CONFIG.output || force) {
            CONFIG.output = name;
        }
    };

    /**
     * @param {HandlerExtension} extend    A function to extend the handler class
     */
    export function extendHandler(extend: HandlerExtension) {
        extensions.push(extend);
    };

    /**
     * @param {string | TypesetCall} fn    The name of a Handler method or a function to call during typesetting
     * @param {number} priority            The priority of the call (so extensions can add calls at the right place)
     */
    export function typesetCall(fn: string | TypesetCall, priority: number) {
        if (typeof fn === 'string') {
            typesetCalls.add((doc: any) => doc[fn](), priority);
        } else {
            typesetCalls.add(fn, priority);
        }
    };

    /**
     * Clear the typeset calls (in case you need to remove the default ones)
     */
    export function clearTypesetCalls() {
        typesetCalls = new PrioritizedList<TypesetCall>();
    };

    /**
     * @param {string | TypesetCall} fn    The name of a Handler method or a function to call during typesetting
     * @param {number} priority            The priority of the call (so extensions can add calls at the right place)
     *                                        priorities of 100 or higher aren't performed for the *2mml() methods
     */
    export function convertCall(fn: string | ConvertCall, priority: number) {
        if (typeof fn === 'string') {
            convertCalls.add((math: any, doc: any) => math[fn](doc), priority);
        } else {
            convertCalls.add(fn, priority);
        }
    };

    /**
     * Clear the convert calls (in case you need to remove the default ones)
     */
    export function clearConvertCalls() {
        convertCalls = new PrioritizedList<ConvertCall>();
    }

    /**
     * The default ready() function called when all the packages have been loaded
     *   (setting MathJax.startup.ready in the configuration will override this,
     *    but you can call MathJax.startup.defaultReady() within your own ready function
     *    if needed, or can use the individual methods below to perform portions
     *    of the default startup actions.)
     */
    export function defaultReady() {
        getComponents();
        makeMethods();
        if (CONFIG.typeset && MathJax.TypesetPromise) {
            promise = pagePromise.then(() => MathJax.TypesetPromise());
        }
    };

    /**
     * Create the instances of the registered components
     */
    export function getComponents() {
        visitor = new MathJax._.core.MmlTree.SerializedMmlVisitor.SerializedMmlVisitor();
        mathjax = MathJax._.mathjax.MathJax;
        input = getInputJax();
        output = getOutputJax();
        adaptor = getAdaptor();
        handler = getHandler();
    };

    /**
     * Make the typeset and conversion methods based on the registered components
     *
     * If there are both input and output jax,
     *   Make Typeset() and TypesetPromise() methods using the given jax,
     *    and TypesetClear() to clear the existing math items
     * For each input jax
     *   Make input2mml() and input2mmlPromise() conversion metods and inputReset() method
     *   If there is a registered output jax
     *     Make input2output() and input2outputPromise conversion methods and outputStylesheet() method
     */
    export function makeMethods() {
        if (!handler) return;
        mathjax.handlers.register(handler);
        document = mathjax.document(CONFIG.document, {...MathJax.config.options, InputJax: input, OutputJax: output});
        if (input && output) {
            makeTypesetMethods();
        }
        const oname = (output ? (output.constructor as typeof AbstractOutputJax).NAME.toLowerCase() : '');
        for (const jax of input) {
            const iname = (jax.constructor as typeof AbstractInputJax).NAME.toLowerCase();
            makeMmlMethods(iname, jax);
            makeResetMethod(iname, jax);
            if (output) {
                makeOutputMethods(iname, oname, jax);
            }
        }
    };

    /**
     * Create the Typeset(elements?), TypesetPromise(elements?), and TypesetClear() methods.
     *
     * The first two call the registered typesetCalls in prioritized order, with the latter
     *   wrapped in handleRetriesFor() and returning the resulting promise.
     *
     * TypeseClear() clears all the MathItems from the document.
     */
    export function makeTypesetMethods() {
        MathJax.Typeset = (which: any = null) => {
            elements = which;
            for (const fn of typesetCalls) {
                fn.item(document);
            }
        };
        MathJax.TypesetPromise = (which: any = null) => {
            elements = which;
            return mathjax.handleRetriesFor(() => {
                for (const fn of typesetCalls) {
                    fn.item(document);
                }
            })
        };
        MathJax.Clear = () => document.clear();
    };

    /**
     * Make the input2output(math, display?, em?, ex?, cwidth?)
     *   and input2outuputPromise(math, display? , em?, ex?, cwidth?) methods,
     *   and outputStylesheet() method, where "input" and "output" are replaced by the
     *   jax names (e.g., tex2chtml() and chtmlStyleSheet()).
     *
     * The first two create a MathItem for the given math string (in display mode if display is true),
     *   with the given em and ex metrics, with the specified container width, and then
     *   performs the registered convertCalls on it, with the Promise version wrapped in
     *   handlerRetriesFor() and returning the resulting promise.  The return value is the
     *   DOM object for the converted math.  Use MathJax.startup.adaptor.outerHTML(result)
     *   to get the serialized string version of the output.
     *
     * The outputStylesheet() method returns the styleSheet object for the output.
     * Use MathJax.startup.adaptor.innerHTML(MathJax.outputStylesheet()) to get the serialized
     *   version of the stylesheet.
     *
     * @param {string} iname     The name of the input jax
     * @param {string} oname     The name of the output jax
     * @param {INPUTJAX} input   The input jax instance
     */
    export function makeOutputMethods(iname: string, oname: string, input: INPUTJAX) {
        const name = iname + '2' + oname;
        MathJax[name] =
            (math: string, display: boolean = true, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new document.options.MathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return convertMath(mitem, document);
            };
        MathJax[name + 'Promise'] =
            (math: string, display: boolean = true, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new document.options.MathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return mathjax.handleRetriesFor(() => convertMath(mitem, document));
            };
        MathJax[oname + 'Stylesheet'] = () => output.styleSheet(document);
    };

    /**
     * Make the input2mml(math, display?, em? , ex?, cwidth?) and
     *   input2mmlPromise(math, display?, em? , ex?, cwidth?) methods, where "input" is
     *   replaced by the name of the input jax (e.g., "tex2mml").
     *
     * These convert the math to its serialized MathML representation.  The second wraps the conversion
     *   in handleRetriesFor() and returns the resulting promise.
     *
     * @param {string} name     The name of the input jax
     * @param {input} INPUTJAX  The input jax itself
     */
    export function makeMmlMethods(name: string, input: INPUTJAX) {
        MathJax[name + '2mml'] =
            (math: string, display: boolean = true, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new document.options.MathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return convertMath(mitem, document, 100);
            };
        MathJax[name + '2mmlPromise'] =
            (math: string, display: boolean = true, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new document.options.MathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return mathjax.handleRetriesFor(() => convertMath(mitem, document, 100));
            };
    };

    /**
     * Creates the inputReset() method, where "input" is replaced by the input jax name (e.g., "texReset()).
     *
     * The texReset() method clears the equation numbers and labels
     *
     * @param {string} name     The name of the input jax
     * @param {input} INPUTJAX  The input jax itself
     */
    export function makeResetMethod(name: string, input: INPUTJAX) {
        if (name === 'tex') {
            MathJax.texReset = () => (input as TEX).parseOptions.tags.reset();
        }
    };

    /**
     * Called by input2output() and input2mml() methods to perform the conversions
     *
     * @param {MATHITEM} mitem      The MathItem whose math is to be converted
     * @param {DOCUMENT} document   The MathDocument in which the conversion takes palce
     * @param {number} maxPriority  The priority where processing should stop (for input2mml())
     * @return {any}                The serialized MathML or the DOM node for the converted result
     */
    export function convertMath(mitem: MATHITEM, document: MATHDOCUMENT, maxPriority: number = 0) {
        for (const {item, priority} of convertCalls) {
            if (maxPriority === 0 || priority < maxPriority) {
                item(mitem, document);
            }
        }
        return (maxPriority ? toMML(mitem.root) : mitem.typesetRoot);
    };

    /**
     * @return {INPUTJAX[]}  The array of instances of the registered input jax
     */
    export function getInputJax() {
        const jax = [] as INPUTJAX[];
        for (const name of CONFIG.input) {
            const inputClass = constructors[name];
            if (inputClass) {
                jax.push(new inputClass(MathJax.config[name]));
            } else {
                throw Error('Input Jax "' + name + '" is not defined (has it been loaded?)');
            }
        }
        return jax;
    };

    /**
     * @return {OUTPUTJAX}   The instance of the registered output jax
     */
    export function getOutputJax() {
        const name = CONFIG.output;
        if (!name) return null;
        const outputClass = constructors[name];
        if (!outputClass) {
            throw Error('Output Jax "' + name + '" is not defined (has it been loaded?)');
        }
        return new outputClass(MathJax.config[name]) as OUTPUTJAX;
    };

    /**
     * @return {DOMADAPTOR}  The instance of the registered DOMAdator (the registered constructor
     *                         in this case is a function that creates the adaptor, not a class)
     */
    export function getAdaptor() {
        const name = CONFIG.adaptor;
        if (!name || name === 'none') return null;
        const adaptor = constructors[name];
        if (!adaptor) {
            throw Error('DOMAdaptor "' + name + '" is not defined (has it been loaded?)');
        }
        return adaptor(MathJax.config[name]) as DOMADAPTOR;
    };

    /**
     * @return {HANDLER}  The instance of the registered Handler, extended by the registered extensions
     */
    export function getHandler() {
        const name = CONFIG.handler;
        if (!name || name === 'none' || !adaptor) return null;
        const handlerClass = constructors[name];
        if (!handlerClass) {
            throw Error('Handler "' + name + '" is not defined (has it been loaded?)');
        }
        const handler = new handlerClass(adaptor, 5);
        return extensions.reduce((handler, extend) => extend(handler), handler);
    };

};

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = MJGlobal as MathJaxObject;

/*
 * If the startup module hasn't been added to the MathJax variable,
 *   Add the startup configuration and data objects, and create
 *   the initial typeset and conversion calls.
 */
if (typeof MathJax._.startup === 'undefined') {

    combineDefaults(MathJax.config, 'startup', {
        input: [],
        output: '',
        handler: null,
        adaptor: null,
        document: (typeof document === 'undefined' ? '' : document),
        elements: null,
        typeset: true,
        ready: Startup.defaultReady.bind(Startup)
    });
    combineWithMathJax({
        startup: Startup,
        options: {}
    });

    const findMath = (document: MATHDOCUMENT) => {
        const elements = Startup.elements;
        return document.findMath(elements ? {elements} : {});
    }

    Startup.typesetCall(findMath, 10);
    Startup.typesetCall('compile', 20);
    Startup.typesetCall('getMetrics', 110);
    Startup.typesetCall('typeset', 120);
    Startup.typesetCall('updateDocument', 130);
    Startup.typesetCall('reset', 200);

    Startup.convertCall('compile', 20);
    Startup.convertCall('typeset', 120);
}

/**
 * Export the loader configuration for convenience
 */
export const CONFIG = MathJax.config.startup;


/*
 * Tells if the user configuration included input jax or not
 */
const inputSpecified = CONFIG.input.length !== 0;
