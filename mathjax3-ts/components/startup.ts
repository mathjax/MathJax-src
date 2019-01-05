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

export type MATHDOCUMENT = MathDocument<any, any, any>;
export type MATHITEM = MathItem<any, any, any>;
export type HANDLER = Handler<any, any, any>;
export type DOMADAPTOR = DOMAdaptor<any, any, any>;
export type INPUTJAX = InputJax<any, any, any>;
export type OUTPUTJAX = OutputJax<any, any, any>;
export type TEX = TeX<any, any, any>;

export type HandlerExtension = (handler: HANDLER) => HANDLER;
export type TypesetCall = (document: MATHDOCUMENT) => void;
export type ConvertCall = (math: MATHITEM, document: MATHDOCUMENT) => void;

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
        getInputJax(): void;
        getOutputJax(): void;
        getAdaptor(): void;
        getHandler(): void;
    };
    [name: string]: any;
}

declare var global: {document: Document};

namespace Startup {

    const extensions: HandlerExtension[] = [];
    let typesetCalls = new PrioritizedList<TypesetCall>();
    let convertCalls = new PrioritizedList<ConvertCall>();
    let visitor: any;
    let mathjax: any;

    export const constructors: {[name: string]: any} = {};
    export let input: INPUTJAX[] = [];
    export let output: OUTPUTJAX = null;
    export let handler: HANDLER = null;
    export let adaptor: DOMADAPTOR = null;
    export let elements: any[] = null;
    export let document: MATHDOCUMENT = null;
    export let promise: Promise<void> = null;

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

    export function toMML(node: MmlNode) {
        return visitor.visitTree(node, document);
    };

    export function registerConstructor(name: string, constructor: any) {
        constructors[name] = constructor;
    };

    export function useHandler(name: string, force: boolean = false) {
        if (!CONFIG.handler || force) {
            CONFIG.handler = name;
        }
    };

    export function useAdaptor(name: string, force: boolean = false) {
        if (!CONFIG.adaptor || force) {
            CONFIG.adaptor = name;
        }
    };

    export function useInput(name: string, force: boolean = false) {
        if (!inputSpecified || force) {
            CONFIG.input.push(name);
        }
    };

    export function useOutput(name: string, force: boolean = false) {
        if (!CONFIG.output || force) {
            CONFIG.output = name;
        }
    };

    export function extendHandler(extend: HandlerExtension) {
        extensions.push(extend);
    };

    export function typesetCall(fn: string | TypesetCall, priority: number) {
        if (typeof fn === 'string') {
            typesetCalls.add((doc: any) => doc[fn](), priority);
        } else {
            typesetCalls.add(fn, priority);
        }
    };

    export function clearTypesetCalls() {
        typesetCalls = new PrioritizedList<TypesetCall>();
    };

    export function convertCall(fn: string | ConvertCall, priority: number) {
        if (typeof fn === 'string') {
            convertCalls.add((math: any, doc: any) => math[fn](doc), priority);
        } else {
            convertCalls.add(fn, priority);
        }
    };

    export function clearConvertCalls() {
        convertCalls = new PrioritizedList<ConvertCall>();
    }

    export function defaultReady() {
        getComponents();
        makeMethods();
        if (CONFIG.typeset && MathJax.TypesetPromise) {
            promise = pagePromise.then(() => MathJax.TypesetPromise());
        }
    };

    export function getComponents() {
        visitor = new MathJax._.core.MmlTree.SerializedMmlVisitor.SerializedMmlVisitor();
        mathjax = MathJax._.mathjax.MathJax;
        input = getInputJax();
        output = getOutputJax();
        adaptor = getAdaptor();
        handler = getHandler();
    };

    export function makeMethods() {
        if (!handler) return;
        mathjax.handlers.register(handler);
        document = mathjax.document(CONFIG.document, {InputJax: input, OutputJax: output});
        if (input && output) {
            makeTypesetMethods();
        }
        const oname = (output ? (output.constructor as typeof AbstractOutputJax).NAME.toLowerCase() : '');
        for (const jax of input) {
            const iname = (jax.constructor as typeof AbstractInputJax).NAME.toLowerCase();
            if (output && handler) {
                makeOutputMethods(iname, oname, jax);
            }
            makeMmlMethods(iname, jax);
            makeResetMethod(iname, jax);
        }
    };

    export function makeTypesetMethods() {
        MathJax.Typeset = (which: any = null) => {
            elements = which;
            for (const fn of typesetCalls) {
                fn.item(document);
            }
        };
        MathJax.TypesetPromise = (which: any = null) => {
            elements = which;
            return MathJax._.mathjax.MathJax.handleRetriesFor(() => {
                for (const fn of typesetCalls) {
                    fn.item(document);
                }
            })
        };
    };

    export function makeOutputMethods(iname: string, oname: string, input: INPUTJAX) {
        const name = iname + '2' + oname;
        MathJax[name] =
            (math: string, display: boolean, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new MathJax._.core.MathItem.AbstractMathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return convertMath(mitem, document);
            };
        MathJax[name + 'Promise'] =
            (math: string, display: boolean, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new MathJax._.core.MathItem.AbstractMathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return MathJax._.mathjax.MathJax.handleRetriesFor(() => convertMath(mitem, document));
            };
        MathJax[oname + 'Stylesheet'] = () => output.styleSheet(document);
    };

    export function makeMmlMethods(name: string, input: INPUTJAX) {
        MathJax[name + '2mml'] =
            (math: string, display: boolean, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new MathJax._.core.MathItem.AbstractMathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return convertMath(mitem, document, 100);
            };
        MathJax[name + '2mmlPromise'] =
            (math: string, display: boolean, em: number = 16, ex: number = 8, cwidth:number = 80 * 16) => {
                const mitem = new MathJax._.core.MathItem.AbstractMathItem(math, input, display);
                mitem.setMetrics(em, ex, cwidth, 1000000, 1);
                return MathJax._.mathjax.MathJax.handleRetriesFor(() => convertMath(mitem, document, 100));
            };
    };

    export function makeResetMethod(name: string, input: INPUTJAX) {
        if (name === 'tex') {
            MathJax.texReset = () => (input as TEX).parseOptions.tags.reset();
        }
    };

    export function convertMath(mitem: MATHITEM, document: MATHDOCUMENT, maxPriority: number = 0) {
        for (const {item, priority} of convertCalls) {
            if (maxPriority === 0 || priority < maxPriority) {
                item(mitem, document);
            }
        }
        return (maxPriority ? toMML(mitem.root) : mitem.typesetRoot);
    };

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

    export function getOutputJax() {
        const name = CONFIG.output;
        if (!name) return null;
        const outputClass = constructors[name];
        if (!outputClass) {
            throw Error('Output Jax "' + name + '" is not defined (has it been loaded?)');
        }
        return new outputClass(MathJax.config[name]) as OUTPUTJAX;
    };

    export function getAdaptor() {
        const name = CONFIG.adaptor;
        if (!name || name === 'none') return null;
        const adaptor = constructors[name];
        if (!adaptor) {
            throw Error('DOMAdaptor "' + name + '" is not defined (has it been loaded?)');
        }
        return adaptor(MathJax.config[name]) as DOMADAPTOR;
    };

    export function getHandler() {
        const name = CONFIG.handler;
        if (!name || name === 'none' || !adaptor) return null;
        const handlerClass = constructors[name];
        if (!handlerClass) {
            throw Error('Handler "' + name + '" is not defined (has it been loaded?)');
        }
        const handler = new handlerClass(adaptor, 5, MathJax.config[name]);
        return extensions.reduce((handler, extend) => extend(handler), handler);
    };

};

export const MathJax = MJGlobal as MathJaxObject;

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
        startup: Startup
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

    Startup.convertCall('compile', 10);
    Startup.convertCall('typeset', 110);
}

export const CONFIG = MathJax.config.startup;
const inputSpecified = CONFIG.input.length !== 0;
