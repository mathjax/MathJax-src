import {MathJax as MJGlobal, MathJaxObject as MJObject, MathJaxLibrary as MJLibrary,
        MathJaxConfig as MJConfig, combineWithMathJax} from './global.js';
import {Package} from './package.js';
export {Package} from './package.js';

export interface MathJaxConfig extends MJConfig {
    loader?: {
        paths?: {[name: string]: string};          // The path prefixes for use in locations
        source?: {[name: string]: string};         // The URLs for the extensions, e.g., tex: [mathjax]/input/tex.js
        dependencies?: {[name: string]: string[]}; // The depenedcies for each package
        load?: string[];                           // The packages to load (found in locations or [mathjax]/name])
        ready?: () => void;                        // A function to call when MathJax is ready
        failed?: (message: string) => void;        // A function to call when MathJax fails to load
        require?: (url: string) => any;            // A function for loading URLs
        [name: string]: any;                       // Other configuration blocks
    };
};

export interface MathJaxLibrary extends MJLibrary {
    components: {
        package: {
            Package: typeof Package;
        }
    }
}

export interface MathJaxObject extends MJObject {
    _: MathJaxLibrary;
    config: MathJaxConfig;
    loader: {
        ready: (...names: string[]) => Promise<void>;
        load: (...names: string[]) => Promise<string>;
    };
    startup?: any;
}

export namespace Loader {

    export function ready(...names: string[]) {
        if (names.length === 0) {
            names = Array.from(Package.packages.keys());
        }
        const promises = [];
        for (const name of names) {
            let extension = Package.packages.get(name);
            if (!extension) {
                extension = new Package(name, true);
            }
            promises.push(extension.promise);
        }
        return Promise.all(promises);
    };

    export function load(...names: string[]) {
        if (names.length === 0) {
            return Promise.resolve();
        }
        const promises = [];
        for (const name of names) {
            let extension = Package.packages.get(name);
            if (!extension) {
                extension = new Package(name);
            }
            extension.checkNoLoad();
            promises.push(extension.promise);
        }
        Package.loadAll();
        return Promise.all(promises);
    };

    export function defaultReady() {
        if (typeof MathJax.startup !== 'undefined') {
            MathJax.config.startup.ready();
        }
    };

};

export const MathJax = MJGlobal as MathJaxObject;

if (typeof MathJax._.components === 'undefined') {

    const config = MathJax.config.loader || {};
    MathJax.config.loader = {
        paths: {
            mathjax: '.'
        },
        source: {},
        dependencies: {},
        load: [],
        ready: Loader.defaultReady.bind(Loader),
        failed: (message: string, name: string = '*') => console.log(`MathJax(${name}): ${message}`),
        require: null
    };
    combineWithMathJax({
        _: {components: {package: {Package: Package}}} as MathJaxLibrary,
        loader: Loader,
        config: {loader: config}
    });

}

export const CONFIG = MathJax.config.loader;
