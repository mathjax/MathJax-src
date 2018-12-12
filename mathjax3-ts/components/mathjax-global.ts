export interface MathJaxConfig {
    base?: string;                        // The base URL for MathJax
    paths?: {[name: string]: string};     // The path prefixes for use in locations
    locations?: {[name: string]: string}; // The URLs for individual extensions, e.g., [mathjax]/input/tex
    load?: string[];                      // The names of the extensions to load (found in locations or [mathjax]/name])
    input?: ([string, any] | string)[];   // The names and options for the input jax to use
    output?: [string, any] | string;      // The name and options for the output jax to use
    handlers?: string[] | string;         // The handlers to register
    adaptor?: [string, any] | string;     // The name and options for the DOM adaptor
    ready?: () => void;                   // A function to call when MathJax is ready
};

export interface MathJaxObject {
    version: string;
    _: Object;
    config: MathJaxConfig;
};

declare const global: {MathJax: MathJaxObject | MathJaxConfig};

if (typeof global.MathJax === 'undefined') {
    global.MathJax = {} as MathJaxConfig;
}

export const MathJax = {
    version: '3.0.0',
    _: {},
    config: {}
};

export function combineConfig(dst: any, src: any) {
    for (const id of Object.keys(src)) {
        if (typeof dst[id] === 'object' && typeof src[id] === 'object') {
            combineConfig(dst[id], src[id]);
        } else {
            dst[id] = src[id];
        }
    }
    return dst;
}

export function combineWithMathJax(config: any): MathJaxObject {
    return combineConfig(global.MathJax, config);
}

if (!(global.MathJax as MathJaxObject).version) {
    global.MathJax = combineConfig(MathJax, {config: global.MathJax});
}
