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
 * @file  A dynamic loader for loading MathJax components based
 *                on a user configuration, while handling timing of
 *                dependencies properly
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  MathJax as MJGlobal,
  MathJaxObject as MJObject,
  MathJaxLibrary,
  MathJaxConfig as MJConfig,
  combineWithMathJax,
  combineDefaults,
} from './global.js';
import {
  Package,
  PackageError,
  PackageReady,
  PackageFailed,
  PackageConfig,
} from './package.js';
import { FunctionList } from '../util/FunctionList.js';
import { mjxRoot } from '#root/root.js';
import { context } from '../util/context.js';

/**
 * Function used to determine path to a given package.
 */
export type PathFilterFunction = (data: {
  name: string;
  original: string;
  addExtension: boolean;
}) => boolean;
export type PathFilterList = (
  | PathFilterFunction
  | [PathFilterFunction, number]
)[];

/**
 * Update the configuration structure to include the loader configuration
 */
/* prettier-ignore */
export interface MathJaxConfig extends MJConfig {
  loader?: {
    paths?: {[name: string]: string};          // The path prefixes for use in locations
    source?: {[name: string]: string};         // The URLs for the extensions, e.g., tex: [mathjax]/input/tex.js
    dependencies?: {[name: string]: string[]}; // The dependencies for each package
    provides?: {[name: string]: string[]};     // The sub-packages provided by each package
    load?: string[];                           // The packages to load (found in locations or [mathjax]/name])
    ready?: PackageReady;                      // A function to call when MathJax is ready
    failed?: PackageFailed;                    // A function to call when MathJax fails to load
    require?: (url: string) => any;            // A function for loading URLs
    pathFilters?: PathFilterList;              // List of path filters (and optional priorities) to add
    versionWarnings?: boolean;                 // True means warn when extension version doesn't match MJ version
    [name: string]: any;                       // Other configuration blocks
  };
}

/**
 * Update the MathJax object to inclide the loader information
 */
export interface MathJaxObject extends MJObject {
  _: MathJaxLibrary;
  config: MathJaxConfig;
  loader: {
    ready: (...names: string[]) => Promise<string[]>; // Get a promise for when all the named packages are loaded
    load: (...names: string[]) => Promise<string>; // Load the packages and return a promise for when ready
    preLoaded: (...names: string[]) => void; // Indicate that packages are already loaded by hand
    defaultReady: () => void; // The function performed when all packages are loaded
    getRoot: () => string; // Find the root URL for the MathJax files
    checkVersion: (name: string, version: string) => boolean; // Check the version of an extension
    saveVersion: (name: string) => void; // Set the version for a combined component
    pathFilters: FunctionList; // The filters to use for looking for package paths
    addPackageData: (name: string, data: PackageConfig) => void; // Add more package data for a package
  };
  startup?: any;
}

/**
 * Functions used to filter the path to a package
 */
export const PathFilters: { [name: string]: PathFilterFunction } = {
  /**
   * Look up the path in the configuration's source list
   *
   * @param {PathFilterFunction} data The data object containing the filter functions
   * @returns {boolean} True
   */
  source: (data) => {
    if (Object.hasOwn(CONFIG.source, data.name)) {
      data.name = CONFIG.source[data.name];
    }
    return true;
  },

  /**
   * Add [mathjax] before any relative path
   *
   * @param {PathFilterFunction} data The data object containing the filter functions
   * @returns {boolean} True
   */
  normalize: (data) => {
    const name = data.name;
    if (!name.match(/^(?:[a-z]+:\/)?\/|[a-z]:[/\\]|\[/i)) {
      data.name = '[mathjax]/' + name.replace(/^\.\//, '');
    }
    return true;
  },

  /**
   * Recursively replace path prefixes (e.g., [mathjax], [tex], etc.)
   *
   * @param {PathFilterFunction} data The data object containing the filter functions
   * @returns {boolean} True
   */
  prefix: (data) => {
    let match;
    while ((match = data.name.match(/^\[([^\]]*)\]/))) {
      if (!Object.hasOwn(CONFIG.paths, match[1])) break;
      data.name = CONFIG.paths[match[1]] + data.name.substring(match[0].length);
    }
    return true;
  },

  /**
   * Add .js, if missing
   *
   * @param {PathFilterFunction} data The data object containing the filter functions
   * @returns {boolean} True
   */
  addExtension: (data) => {
    if (data.addExtension && !data.name.match(/\.[^/]+$/)) {
      data.name += '.js';
    }
    return true;
  },
};

/**
 * The version of MathJax that is running.
 */
const VERSION = MJGlobal.version;

/**
 * The implementation of the dynamic loader
 */
export const Loader = {
  /**
   * The versions of all the loaded extensions.
   */
  versions: new Map<string, string>(),

  /**
   * Array of nested load promises so if component performs additional
   * loads (like an output jax with an alternate font), then the
   * outer load promises won't resolve until the inner ones are complete.
   */
  nestedLoads: [] as Promise<any[]>[],

  /**
   * Get a promise that is resolved when all the named packages have been loaded.
   *
   * @param {string[]} names  The packages to wait for
   * @returns {Promise}       A promise that resolves when all the named packages are ready
   */
  ready(...names: string[]): Promise<string[]> {
    if (names.length === 0) {
      names = Array.from(Package.packages.keys());
    }
    const promises = [];
    for (const name of names) {
      const extension = Package.packages.get(name) || new Package(name, true);
      promises.push(extension.promise);
    }
    return Promise.all(promises);
  },

  /**
   * Load the named packages and return a promise that is resolved when they are all loaded
   *
   * @param {string[]} names  The packages to load
   * @returns {Promise<any[]>}  A promise that resolves when all the named packages are ready
   */
  load(...names: string[]): Promise<any[]> {
    if (names.length === 0) {
      return Promise.resolve([]);
    }
    //
    // Add a new array to store promises for this load() call
    //
    let nested = [] as Promise<any>[];
    this.nestedLoads.unshift(nested);
    //
    // Create a promise for this load() call
    //
    const promise = Promise.resolve().then(async () => {
      //
      // Collect the promises for all the named packages,
      // creating the package if needed, and add checks
      // for the version numbers used in the components.
      //
      const promises = [];
      for (const name of names) {
        let extension = Package.packages.get(name);
        if (!extension) {
          extension = new Package(name);
          extension.provides(CONFIG.provides[name]);
        }
        extension.checkNoLoad();
        promises.push(
          extension.promise.then(() => {
            if (
              CONFIG.versionWarnings &&
              extension.isLoaded &&
              !Loader.versions.has(Package.resolvePath(name))
            ) {
              console.warn(
                `No version information available for component ${name}`
              );
            }
            return extension.result;
          }) as Promise<any>
        );
      }
      //
      // Load everything that was requested and wait for
      // them to be loaded.
      //
      Package.loadAll();
      const result = await Promise.all(promises);
      //
      // If any other loads occurred while we were waiting,
      // Wait for those promises, and clear the list so that
      // if even MORE loads occur while waiting for those,
      // we can wait for them, too.  Keep doing that until
      // no additional loads occurred, in which case we are
      // now done.
      //
      while (nested.length) {
        const promise = Promise.all(nested);
        nested = this.nestedLoads[this.nestedLoads.indexOf(nested)] = [];
        await promise;
      }
      //
      // Remove the (empty) list from the nested list,
      // and return the result.
      //
      this.nestedLoads.splice(this.nestedLoads.indexOf(nested), 1);
      return result;
    });
    //
    // Add this load promise to the lists for any parent load() call that are
    // pending when this load() was performed, then return the load promise.
    //
    this.nestedLoads
      .slice(1)
      .forEach((list: Promise<any>[]) => list.push(promise));
    return promise;
  },

  /**
   * Indicate that the named packages are being loaded by hand (e.g., as part of a larger package).
   *
   * @param {string[]} names  The packages to load
   */
  preLoaded(...names: string[]) {
    for (const name of names) {
      let extension = Package.packages.get(name);
      if (!extension) {
        extension = new Package(name, true);
        extension.provides(CONFIG.provides[name]);
      }
      extension.loaded();
    }
  },

  /**
   * Insert options into a package configuration
   *
   * @param {string} name         The package whose configuration is being augmented
   * @param {PackageConfig} data  The extra configuraiton information to add
   */
  addPackageData(name: string, data: PackageConfig) {
    let config = CONFIG[name];
    if (!config) {
      config = CONFIG[name] = {};
    }
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        if (!config[key]) {
          config[key] = [];
        }
        const set = new Set([...config[key], ...value]);
        config[key] = [...set];
      } else {
        config[key] = value;
      }
    }
  },

  /**
   * The default function to perform when all the packages are loaded
   */
  defaultReady() {
    if (typeof MathJax.startup !== 'undefined') {
      MathJax.config.startup.ready();
    }
  },

  /**
   * Get the root location for where the MathJax package files are found
   *
   * @returns {string}   The root location (directory for node.js, URL for browser)
   */
  getRoot(): string {
    if (context.document) {
      const script =
        context.document.currentScript ||
        context.document.getElementById('MathJax-script');
      if (script && script instanceof HTMLScriptElement) {
        return script.src.replace(/\/[^/]*$/, '');
      }
    }
    return mjxRoot();
  },

  /**
   * Check the version of an extension and report an error if not correct
   *
   * @param {string} name       The name of the extension being checked
   * @param {string} version    The version of the extension to check
   * @param {string} _type       The type of extension (future code may use this to check ranges of versions)
   * @returns {boolean}          True if there was a mismatch, false otherwise
   */
  checkVersion(name: string, version: string, _type?: string): boolean {
    this.saveVersion(name);
    if (CONFIG.versionWarnings && version !== VERSION) {
      console.warn(
        `Component ${name} uses ${version} of MathJax; version in use is ${VERSION}`
      );
      return true;
    }
    return false;
  },

  /**
   * Set the version of an extension (used for combined components so they can be loaded)
   *
   * @param {string} name       The name of the extension being checked
   */
  saveVersion(name: string) {
    Loader.versions.set(Package.resolvePath(name), VERSION);
  },

  /**
   * The filters to use to modify the paths used to obtain the packages
   */
  pathFilters: new FunctionList(),
};

/**
 * The default filters to use.
 */
Loader.pathFilters.add(PathFilters.source, 0);
Loader.pathFilters.add(PathFilters.normalize, 10);
Loader.pathFilters.add(PathFilters.prefix, 20);
Loader.pathFilters.add(PathFilters.addExtension, 30);

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = MJGlobal as MathJaxObject;

/*
 * If the loader hasn't been added to the MathJax variable,
 *   Add the loader configuration, library, and data objects.
 *   Add any path filters from the configuration.
 */
if (typeof MathJax.loader === 'undefined') {
  combineDefaults(MathJax.config, 'loader', {
    paths: {
      mathjax: Loader.getRoot(),
      fonts: context.window
        ? 'https://cdn.jsdelivr.net/npm/@mathjax'
        : '@mathjax',
    },
    source: {},
    dependencies: {},
    provides: {},
    load: [],
    ready: Loader.defaultReady.bind(Loader),
    failed: (error: PackageError) =>
      console.log(`MathJax(${error.package || '?'}): ${error.message}`),
    require: null,
    pathFilters: [],
    versionWarnings: true,
  });
  combineWithMathJax({
    loader: Loader,
  });

  //
  // Add any path filters from the configuration
  //
  for (const filter of MathJax.config.loader.pathFilters) {
    if (Array.isArray(filter)) {
      Loader.pathFilters.add(filter[0], filter[1]);
    } else {
      Loader.pathFilters.add(filter);
    }
  }
}

/**
 * Export the loader configuration for convenience
 */
export const CONFIG = MathJax.config.loader;
