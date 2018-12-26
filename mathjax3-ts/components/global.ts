export interface MathJaxConfig {[name: string]: any};
export interface MathJaxLibrary {[name: string]: any};

export interface MathJaxObject {
    version: string;
    _: MathJaxLibrary;
    config: MathJaxConfig;
};

declare const global: {MathJax: MathJaxObject | MathJaxConfig};

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


if (typeof global.MathJax === 'undefined') {
    global.MathJax = {} as MathJaxConfig;
}

if (!(global.MathJax as MathJaxObject).version) {
    global.MathJax = {
        version: '3.0.0',
        _: {},
        config: global.MathJax
    };
}

export const MathJax = global.MathJax;
